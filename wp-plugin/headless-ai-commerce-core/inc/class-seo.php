<?php
/**
 * SEO Module
 * Intercepts WP API to inject SEO metadata and triggers AI generation on post save.
 */

class HAIC_SEO {
    private $ai_engine;

    public function __construct( HAIC_AI_Engine $ai_engine ) {
        $this->ai_engine = $ai_engine;

        // Register custom fields in REST API
        add_action( 'rest_api_init', [ $this, 'register_seo_meta_in_rest' ] );
        
        // Trigger AI on post save
        add_action( 'save_post', [ $this, 'generate_and_save_seo_data' ], 10, 3 );
    }

    public function register_seo_meta_in_rest() {
        register_rest_field( 'post', 'haic_seo', [
            'get_callback' => [ $this, 'get_seo_meta_for_api' ],
            'schema'       => null,
        ] );
    }

    public function get_seo_meta_for_api( $object ) {
        $post_id = $object['id'];
        return [
            'title'       => get_post_meta( $post_id, '_haic_seo_title', true ),
            'description' => get_post_meta( $post_id, '_haic_seo_description', true ),
        ];
    }

    public function generate_and_save_seo_data( $post_id, $post, $update ) {
        // Skip revisions, autosaves, and non-published posts
        if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || $post->post_status !== 'publish' ) {
            return;
        }

        // Check if we already have SEO data (prevent unnecessary API calls on every update)
        $existing_title = get_post_meta( $post_id, '_haic_seo_title', true );
        if ( ! empty( $existing_title ) ) {
            return;
        }

        // Prevent timeout issues by running asynchronously or in a fast hook, but for now we run sync 
        // since Gemini is fast. A robust production version might queue this in WP-Cron.
        $seo_data = $this->ai_engine->generate_seo_metadata( $post->post_content );

        if ( $seo_data && is_array( $seo_data ) ) {
            update_post_meta( $post_id, '_haic_seo_title', $seo_data['title'] );
            update_post_meta( $post_id, '_haic_seo_description', $seo_data['description'] );
        }
    }
}
