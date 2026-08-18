<?php
/**
 * Settings & Admin UI Module
 */

class HAIC_Settings {

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'register_settings_page' ] );
        add_action( 'admin_init', [ $this, 'register_settings_fields' ] );
    }

    public function register_settings_page() {
        add_menu_page(
            'Headless AI Core',
            'Headless AI Core',
            'manage_options',
            'headless-ai-core',
            [ $this, 'render_settings_ui' ],
            'dashicons-cloud',
            56
        );
    }

    public function register_settings_fields() {
        register_setting( 'haic_settings_group', 'haic_frontend_url' );
        register_setting( 'haic_settings_group', 'haic_headless_mode' );
        register_setting( 'haic_settings_group', 'haic_editor_bypass' );
        register_setting( 'haic_settings_group', 'haic_revalidation_secret' );
        register_setting( 'haic_settings_group', 'haic_gemini_api_key' );
        register_setting( 'haic_settings_group', 'haic_enable_ai_seo' );
    }

    public function render_settings_ui() {
        if ( ! current_user_can( 'manage_options' ) ) return;
        
        $frontend_url = $this->get_frontend_url();
        $is_headless = $this->is_headless_mode();
        $is_constant_url = defined( 'HAIC_FRONTEND_URL' );
        $is_constant_mode = defined( 'HAIC_HEADLESS_MODE' );
        $is_constant_secret = defined( 'HAIC_REVALIDATION_SECRET' );
        $is_constant_gemini = defined( 'HAIC_GEMINI_API_KEY' );
        ?>
        <div class="wrap">
            <h1>Headless AI Commerce Core Settings</h1>
            <?php settings_errors(); ?>
            <form method="post" action="options.php">
                <?php settings_fields( 'haic_settings_group' ); ?>
                <?php do_settings_sections( 'haic_settings_group' ); ?>
                
                <h2>1. Headless Infrastructure</h2>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Enable Headless Mode</th>
                        <td>
                            <input type="checkbox" name="haic_headless_mode" value="1" <?php checked( 1, get_option('haic_headless_mode'), true ); ?> <?php echo $is_constant_mode ? 'disabled' : ''; ?> />
                            <p class="description">Activates traffic redirects to the frontend domain and disables native theme indexation.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Bypass for Editors</th>
                        <td>
                            <input type="checkbox" name="haic_editor_bypass" value="1" <?php checked( 1, get_option('haic_editor_bypass'), true ); ?> />
                            <p class="description">If enabled, logged in Admins and Editors will not be redirected to the Next.js frontend.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Frontend Edge URL</th>
                        <td>
                            <input type="url" name="haic_frontend_url" value="<?php echo esc_url( get_option('haic_frontend_url') ); ?>" class="regular-text" placeholder="https://www.elvaraskinlane.ng" <?php echo $is_constant_url ? 'disabled' : ''; ?> />
                            <p class="description">The URL of your deployed Next.js application.</p>
                        </td>
                    </tr>
                </table>

                <h2>2. Next.js Automation & Webhooks</h2>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Revalidation Secret Token</th>
                        <td>
                            <input type="password" name="haic_revalidation_secret" value="<?php echo esc_attr( get_option('haic_revalidation_secret') ); ?>" class="regular-text" placeholder="Your secret token" <?php echo $is_constant_secret ? 'disabled' : ''; ?> />
                            <p class="description">Secure token used to ping Next.js `/api/revalidate` upon post save.</p>
                        </td>
                    </tr>
                </table>

                <h2>3. AI Engine (Gemini API)</h2>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Enable AI SEO Automation</th>
                        <td>
                            <input type="checkbox" name="haic_enable_ai_seo" value="1" <?php checked( 1, get_option('haic_enable_ai_seo'), true ); ?> />
                            <p class="description">If enabled, publishing a post will automatically generate SEO titles and descriptions using Gemini.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Gemini API Key</th>
                        <td>
                            <input type="password" name="haic_gemini_api_key" value="<?php echo esc_attr( get_option('haic_gemini_api_key') ); ?>" class="regular-text" placeholder="AIzaSy..." <?php echo $is_constant_gemini ? 'disabled' : ''; ?> />
                            <p class="description">Get a free key from Google AI Studio. <?php if ($is_constant_gemini) echo '<br><strong>(Overridden by wp-config.php)</strong>'; ?></p>
                        </td>
                    </tr>
                </table>
                <?php submit_button( 'Save Configuration' ); ?>
            </form>
        </div>
        <?php
    }

    // Getters for other classes
    public function get_frontend_url() {
        if ( defined( 'HAIC_FRONTEND_URL' ) && HAIC_FRONTEND_URL ) return rtrim( HAIC_FRONTEND_URL, '/' );
        return rtrim( get_option( 'haic_frontend_url' ), '/' );
    }

    public function is_headless_mode() {
        if ( defined( 'HAIC_HEADLESS_MODE' ) ) return (bool) HAIC_HEADLESS_MODE;
        return (bool) get_option( 'haic_headless_mode', false );
    }

    public function get_revalidation_secret() {
        if ( defined( 'HAIC_REVALIDATION_SECRET' ) && HAIC_REVALIDATION_SECRET ) return HAIC_REVALIDATION_SECRET;
        return get_option( 'haic_revalidation_secret', '' );
    }

    public function get_gemini_api_key() {
        if ( defined( 'HAIC_GEMINI_API_KEY' ) && HAIC_GEMINI_API_KEY ) return HAIC_GEMINI_API_KEY;
        return get_option( 'haic_gemini_api_key', '' );
    }

    public function is_ai_seo_enabled() {
        return (bool) get_option( 'haic_enable_ai_seo', false );
    }
}
