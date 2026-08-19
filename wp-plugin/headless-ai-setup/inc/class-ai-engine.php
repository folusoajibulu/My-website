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

        $prompt = 'You are an expert SEO and editorial assistant. Your job is to format the provided raw text for web publishing and generate metadata.
CRITICAL RULES:
1. Do NOT rewrite, change, add, or remove ANY sentences or words from the author\'s original text. The text must remain pure and unadulterated.
2. Only add HTML formatting: wrap paragraphs in <p> tags, and insert <h2> subheadings where there are logical transitions.
3. Generate a strict SEO title (max 60 characters).
4. Generate a strict meta description (max 150 characters). Do not copy the first paragraph; concisely summarize the core theme.
5. Extract 5 comma-separated keywords based on the content.

Return ONLY a raw JSON object with this exact structure:
{
  "title": "...",
  "description": "...",
  "keywords": "...",
  "formatted_content": "..."
}

Original Text:
' . wp_strip_all_tags( $content );

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

        // Increase timeout heavily because generating a long formatted post takes time
        $response = wp_remote_post( $request_url, [
            'method'  => 'POST',
            'timeout' => 60, 
            'headers' => [ 'Content-Type' => 'application/json' ],
            'body'    => wp_json_encode( $body )
        ]);

        if ( is_wp_error( $response ) ) {
            return [ 'error' => 'wp_remote_post failed: ' . $response->get_error_message() ];
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        
        if ( $response_code !== 200 ) {
            return [ 'error' => 'API returned code ' . $response_code . '. Body: ' . $response_body ];
        }

        $data = json_decode( $response_body, true );

        if ( isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            $json_text = trim( $data['candidates'][0]['content']['parts'][0]['text'] );
            
            // Robustly strip any markdown formatting
            $json_text = preg_replace('/^```(?:json)?\s*/i', '', $json_text);
            $json_text = preg_replace('/\s*```$/', '', $json_text);
            
            $seo_data = json_decode( $json_text, true );
            
            if ( json_last_error() !== JSON_ERROR_NONE ) {
                return [ 'error' => 'JSON Decode Failed: ' . json_last_error_msg() . ' | Raw: ' . $json_text ];
            }

            if ( isset( $seo_data['title'] ) && isset( $seo_data['description'] ) ) {
                return [
                    'title'             => sanitize_text_field( $seo_data['title'] ),
                    'description'       => sanitize_textarea_field( $seo_data['description'] ),
                    'keywords'          => sanitize_text_field( $seo_data['keywords'] ?? '' ),
                    'formatted_content' => $seo_data['formatted_content'] ?? '', // Sanitize later with wp_kses_post
                ];
            } else {
                return [ 'error' => 'JSON missing title or description. Raw: ' . $json_text ];
            }
        }
        
        return [ 'error' => 'No candidates returned. Body: ' . $response_body ];
    }
}
