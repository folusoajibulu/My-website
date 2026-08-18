<?php
/**
 * Automation & Webhook Module
 * Pings Next.js on demand when posts are saved or trashed.
 */

class HAIC_Automation {
    private $settings;

    public function __construct( HAIC_Settings $settings ) {
        $this->settings = $settings;

        add_action( 'save_post', [ $this, 'trigger_nextjs_revalidation' ], 10, 3 );
        add_action( 'trashed_post', [ $this, 'trigger_nextjs_revalidation_on_trash' ] );
    }

    public function trigger_nextjs_revalidation( $post_id, $post, $update ) {
        if ( wp_is_post_revision( $post_id ) || $post->post_status !== 'publish' ) {
            return;
        }
        $this->send_revalidate_request( $post_id, $post->post_name );
    }

    public function trigger_nextjs_revalidation_on_trash( $post_id ) {
        $post = get_post( $post_id );
        if ( ! $post || $post->post_status !== 'publish' ) {
            return;
        }
        $this->send_revalidate_request( $post_id, $post->post_name );
    }

    private function send_revalidate_request( $post_id, $slug ) {
        $frontend_url = $this->settings->get_frontend_url();
        $secret = $this->settings->get_revalidation_secret();
        
        if ( empty( $frontend_url ) || empty( $secret ) ) return;

        $revalidate_endpoint = $frontend_url . '/api/revalidate?secret=' . urlencode( $secret );

        wp_remote_post( $revalidate_endpoint, [
            'method'      => 'POST',
            'timeout'     => 5,
            'blocking'    => false, // Asynchronous
            'headers'     => [
                'Content-Type' => 'application/json',
            ],
            'body'        => wp_json_encode([
                'post_id' => $post_id,
                'slug'    => $slug
            ])
        ]);
    }
}
