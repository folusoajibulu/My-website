<?php
/**
 * AI Engine Module
 * Connects to Google Gemini API to generate SEO metadata.
 */

class HAIC_AI_Engine {
    private $settings;
    private $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct( HAIC_Settings $settings ) {
        $this->settings = $settings;
    }

    /**
     * Generates SEO Title and Meta Description using Gemini API.
     * @param string $content The post content.
     * @return array|false Returns associative array with 'title' and 'description' or false on failure.
     */
    public function generate_seo_metadata( $content ) {
        if ( ! $this->settings->is_ai_seo_enabled() ) return false;
        
        $api_key = $this->settings->get_gemini_api_key();
        if ( empty( $api_key ) ) return false;

        $prompt = "You are an expert SEO specialist. Read the following article and provide an optimized SEO title (max 60 characters) and a meta description (max 160 characters). Return ONLY valid JSON format like this: {\"title\": \"Your Title\", \"description\": \"Your description\"}.\n\nArticle Content:\n" . wp_strip_all_tags( $content );

        $request_url = $this->api_url . '?key=' . $api_key;
        
        $body = [
            'contents' => [
                [
                    'parts' => [
                        [ 'text' => $prompt ]
                    ]
                ]
            ],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
            ]
        ];

        $response = wp_remote_post( $request_url, [
            'method'  => 'POST',
            'timeout' => 15,
            'headers' => [ 'Content-Type' => 'application/json' ],
            'body'    => wp_json_encode( $body )
        ]);

        if ( is_wp_error( $response ) ) return false;

        $response_code = wp_remote_retrieve_response_code( $response );
        if ( $response_code !== 200 ) return false;

        $response_body = wp_remote_retrieve_body( $response );
        $data = json_decode( $response_body, true );

        if ( isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            $json_text = $data['candidates'][0]['content']['parts'][0]['text'];
            $seo_data = json_decode( $json_text, true );
            
            if ( isset( $seo_data['title'] ) && isset( $seo_data['description'] ) ) {
                return [
                    'title'       => sanitize_text_field( $seo_data['title'] ),
                    'description' => sanitize_textarea_field( $seo_data['description'] ),
                ];
            }
        }

        return false;
    }
}
