<?php
/**
 * AI Engine Module
 * Connects to Google Gemini API to generate SEO metadata.
 */

class HAIC_AI_Engine {
    private $settings;
    private $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

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
        
        $gemini_api_key = $this->settings->get_gemini_api_key();
        $groq_api_key = method_exists($this->settings, 'get_groq_api_key') ? $this->settings->get_groq_api_key() : '';
        
        if ( empty( $gemini_api_key ) && empty( $groq_api_key ) ) return false;

        $prompt = "You are an expert SEO and editorial assistant. Your job is to format the provided raw text for web publishing and generate metadata.
CRITICAL RULES:
1. Do NOT rewrite, change, add, or remove ANY sentences or words from the author's original text. The text must remain pure and unadulterated.
2. Only add HTML formatting: wrap paragraphs in <p> tags, and insert <h2> subheadings where there are logical transitions.
3. Generate a strict SEO title (max 60 characters).
4. Generate a strict meta description (max 150 characters). Do not copy the first paragraph; concisely summarize the core theme.
5. Extract 5 comma-separated keywords based on the content.

Return ONLY a raw JSON object with this exact structure:
{
  \"title\": \"...\",
  \"description\": \"...\",
  \"keywords\": \"...\",
  \"formatted_content\": \"...\"
}

Original Text:
" . wp_strip_all_tags( $content );

        if ( ! empty( $groq_api_key ) ) {
            // Use Groq API
            $request_url = 'https://api.groq.com/openai/v1/chat/completions';
            $headers = [
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $groq_api_key
            ];
            $body = [
                'model' => 'openai/gpt-oss-120b',
                'messages' => [
                    [ 'role' => 'user', 'content' => $prompt ]
                ],
                'response_format' => [ 'type' => 'json_object' ]
            ];
        } else {
            // Use Gemini API
            $request_url = $this->api_url . '?key=' . $gemini_api_key;
            $headers = [ 'Content-Type' => 'application/json' ];
            $body = [
                'contents' => [ [ 'parts' => [ [ 'text' => $prompt ] ] ] ],
                'generationConfig' => [ 'response_mime_type' => 'application/json' ]
            ];
        }

        // Increase timeout heavily because generating a long formatted post takes time
        $response = wp_remote_post( $request_url, [
            'method'  => 'POST',
            'timeout' => 60, 
            'headers' => $headers,
            'body'    => wp_json_encode( $body )
        ]);

        if ( is_wp_error( $response ) ) {
            return [ 'error' => 'wp_remote_post failed: ' . $response->get_error_message() ];
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        
        if ( $response_code !== 200 ) {
            $error_msg = 'API returned code ' . $response_code . '. Body: ' . $response_body;
            
            if ( $response_code === 404 || $response_code === 400 ) {
                if ( ! empty( $groq_api_key ) ) {
                    // Fetch available models for Groq
                    $models_url = 'https://api.groq.com/openai/v1/models';
                    $models_response = wp_remote_get( $models_url, [
                        'headers' => [ 'Authorization' => 'Bearer ' . $groq_api_key ]
                    ]);
                    if ( ! is_wp_error( $models_response ) && wp_remote_retrieve_response_code( $models_response ) === 200 ) {
                        $models_data = json_decode( wp_remote_retrieve_body( $models_response ), true );
                        $available = [];
                        if ( isset( $models_data['data'] ) ) {
                            foreach ( $models_data['data'] as $m ) {
                                $available[] = $m['id'];
                            }
                        }
                        $error_msg .= ' | Available Groq Models: ' . implode( ', ', $available );
                    }
                } else {
                    // Fetch available models for Gemini
                    $models_url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' . $gemini_api_key;
                    $models_response = wp_remote_get( $models_url );
                    if ( ! is_wp_error( $models_response ) && wp_remote_retrieve_response_code( $models_response ) === 200 ) {
                        $models_data = json_decode( wp_remote_retrieve_body( $models_response ), true );
                        $available = [];
                        if ( isset( $models_data['models'] ) ) {
                            foreach ( $models_data['models'] as $m ) {
                                $available[] = str_replace( 'models/', '', $m['name'] );
                            }
                        }
                        $error_msg .= ' | Available Models for your key: ' . implode( ', ', $available );
                    }
                }
            }
            
            return [ 'error' => $error_msg ];
        }

        $data = json_decode( $response_body, true );
        if ( isset( $data['choices'][0]['message']['content'] ) ) {
            $json_text = $data['choices'][0]['message']['content'];
        } elseif ( isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            $json_text = $data['candidates'][0]['content']['parts'][0]['text'];
        } else {
            return [ 'error' => 'No valid response format found. Body: ' . $response_body ];
        }

        $json_text = trim( $json_text );
        
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
}
