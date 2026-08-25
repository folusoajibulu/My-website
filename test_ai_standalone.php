<?php
// Standalone tester for Gemini API without WordPress
$env_file = file_get_contents('.env.local');
preg_match('/GEMINI_API_KEY=(.*)/', $env_file, $matches);
$api_key = isset($matches[1]) ? trim($matches[1]) : '';
if (empty($api_key)) {
    die("No API key found in .env.local\n");
}

$api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
$content = "For decades, the coastal waters of West Africa have been a critical artery for global trade... [omitted for brevity but we use the full text below]";
$full_text = "For decades, the coastal waters of West Africa have been a critical artery for global trade, yet they have simultaneously remained one of the most complex security environments on the continent. The Gulf of Guinea, in particular, handles a massive percentage of the region's economic output, serving as a gateway for both imports and critical energy exports. However, this dense concentration of commercial shipping has inevitably attracted illicit activities, forcing nations to re-evaluate how they police their sovereign waters.\n\nHistorically, the response to piracy and illegal fishing was largely fragmented. Individual nations attempted to secure their own territorial waters with limited naval assets, often resulting in maritime criminals simply slipping across invisible maritime borders to evade capture. This disjointed approach meant that while localized patrols might temporarily suppress threats in one sector, the overall regional risk remained unacceptably high, driving up insurance premiums for commercial vessels and severely impacting local economies.\n\nIn recent years, there has been a profound strategic shift toward unified regional architecture. The Yaoundé Code of Conduct marked a turning point, establishing a framework for intelligence sharing and joint naval operations across multiple jurisdictions. By integrating surveillance networks and committing to cross-border pursuit agreements, West African navies have moved from reactive policing to proactive deterrence, demonstrating that institutional cooperation is the ultimate antidote to maritime instability.";

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
" . strip_tags( $full_text );

$request_url = $api_url . '?key=' . $api_key;
$body = [
    'contents' => [ [ 'parts' => [ [ 'text' => $prompt ] ] ] ],
    'generationConfig' => [ 'response_mime_type' => 'application/json' ]
];

$ch = curl_init($request_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

echo "Calling Gemini API...\n";
$start = microtime(true);
$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);
$end = microtime(true);

echo "Execution time: " . ($end - $start) . " seconds\n";
if ($err) {
    echo "cURL Error: $err\n";
} else {
    $data = json_decode($response, true);
    if (isset($data['error'])) {
        echo "API Error: \n";
        print_r($data['error']);
    } else {
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'NO TEXT';
        echo "Raw text:\n" . $text . "\n\n";
        
        $json_text = trim($text);
        if (strpos($json_text, '```json') === 0) {
            $json_text = substr($json_text, 7);
            if (substr($json_text, -3) === '```') {
                $json_text = substr($json_text, 0, -3);
            }
        }
        $decoded = json_decode($json_text, true);
        echo "Decoded JSON:\n";
        print_r($decoded);
    }
}
