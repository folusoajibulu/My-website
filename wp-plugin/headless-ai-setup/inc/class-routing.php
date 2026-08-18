<?php
/**
 * Headless Infrastructure Module
 * Handles redirects, CORS, WooCommerce URLs, and Password Resets
 */

class HAIC_Routing {
    private $settings;

    public function __construct( HAIC_Settings $settings ) {
        $this->settings = $settings;

        // Redirects
        add_action( 'template_redirect', [ $this, 'handle_edge_redirect' ], 99 );
        add_action( 'send_headers', [ $this, 'disable_backend_indexing' ] );

        // CORS
        add_action( 'rest_api_init', [ $this, 'restrict_cors_headers' ], 15 );

        // WooCommerce
        add_filter( 'woocommerce_get_view_order_url', [ $this, 'rewrite_view_order_url' ], 10, 2 );
        add_filter( 'woocommerce_return_to_shop_redirect', [ $this, 'rewrite_return_to_shop_url' ] );

        // Password Reset
        add_filter( 'retrieve_password_message', [ $this, 'rewrite_reset_password_email' ], 10, 4 );
        add_action( 'rest_api_init', [ $this, 'register_reset_password_endpoint' ] );
    }

    public function handle_edge_redirect() {
        if ( ! $this->settings->is_headless_mode() ) return;

        if ( defined( 'DOING_CRON' ) && DOING_CRON ) return;
        if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) return;
        if ( defined( 'GRAPHQL_HTTP_REQUEST' ) && GRAPHQL_HTTP_REQUEST ) return;
        
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        if ( strpos( $uri, '/wp-json/' ) !== false ) return;
        if ( strpos( $uri, '/wc-api/' ) !== false ) return;
        if ( is_admin() || $GLOBALS['pagenow'] === 'wp-login.php' ) return;

        $bypass_enabled = apply_filters( 'haic_editor_bypass', get_option( 'haic_editor_bypass', false ) );
        if ( $bypass_enabled && current_user_can( 'edit_posts' ) ) {
            return;
        }

        $frontend_url = $this->settings->get_frontend_url();
        if ( empty( $frontend_url ) ) return;

        $redirect_url = $frontend_url . $uri;

        if ( ! apply_filters( 'haic_will_redirect', true, $redirect_url ) ) {
            return;
        }

        wp_redirect( $redirect_url, 301 );
        exit;
    }

    public function disable_backend_indexing() {
        if ( $this->settings->is_headless_mode() ) {
            header( 'X-Robots-Tag: noindex, nofollow, noarchive' );
        }
    }

    public function restrict_cors_headers() {
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        add_filter( 'rest_pre_serve_request', [ $this, 'custom_rest_cors_headers' ] );
    }

    public function custom_rest_cors_headers( $value ) {
        $frontend_url = $this->settings->get_frontend_url();
        $allowed_origins = apply_filters( 'haic_allowed_cors_origins', [ $frontend_url, 'http://localhost:3000' ] );
        
        $origin = get_http_origin();

        if ( $origin && in_array( $origin, $allowed_origins ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
            header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE' );
            header( 'Access-Control-Allow-Credentials: true' );
            header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cart-Token' );
        }
        
        if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            exit;
        }
        return $value;
    }

    public function rewrite_view_order_url( $url, $order ) {
        $frontend_url = $this->settings->get_frontend_url();
        if ( empty( $frontend_url ) ) return $url;
        return $frontend_url . '/account/orders/' . $order->get_id();
    }

    public function rewrite_return_to_shop_url( $url ) {
        $frontend_url = $this->settings->get_frontend_url();
        if ( empty( $frontend_url ) ) return $url;
        return $frontend_url . '/shop';
    }

    public function rewrite_reset_password_email( $message, $key, $user_login, $user_data ) {
        $frontend_url = $this->settings->get_frontend_url();
        if ( empty( $frontend_url ) ) return $message;

        $reset_link = $frontend_url . '/reset-password?key=' . $key . '&login=' . rawurlencode( $user_login );

        return preg_replace(
            '/(https?:\/\/.*?)wp-login\.php\?action=rp&key=(.*?)&login=([^\s<]+)/i',
            $reset_link,
            $message
        );
    }

    public function register_reset_password_endpoint() {
        register_rest_route( 'elvara/v1', '/reset-password', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'process_password_reset' ],
            'permission_callback' => '__return_true',
        ] );
    }

    public function process_password_reset( WP_REST_Request $request ) {
        $key          = $request->get_param( 'key' );
        $user_login   = $request->get_param( 'login' );
        $new_password = $request->get_param( 'new_password' );

        if ( empty( $key ) || empty( $user_login ) || empty( $new_password ) ) {
            return new WP_Error( 'missing_params', 'Missing required parameters.', [ 'status' => 400 ] );
        }

        $user = get_user_by( 'login', $user_login );
        if ( ! $user ) {
            return new WP_Error( 'invalid_user', 'Invalid user.', [ 'status' => 404 ] );
        }

        $check_key = check_password_reset_key( $key, $user_login );
        if ( is_wp_error( $check_key ) ) {
            return new WP_Error( 'invalid_key', 'The reset link is invalid or has expired.', [ 'status' => 400 ] );
        }

        reset_password( $user, $new_password );
        return new WP_REST_Response( [ 'message' => 'Password reset successfully.' ], 200 );
    }
}
