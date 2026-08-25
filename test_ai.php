<?php
require_once dirname(__FILE__) . '/wp-load.php';

$settings = new HAIC_Settings();
$ai_engine = new HAIC_AI_Engine( $settings );

$content = "For decades, the coastal waters of West Africa have been a critical artery for global trade, yet they have simultaneously remained one of the most complex security environments on the continent. The Gulf of Guinea, in particular, handles a massive percentage of the region's economic output, serving as a gateway for both imports and critical energy exports. However, this dense concentration of commercial shipping has inevitably attracted illicit activities, forcing nations to re-evaluate how they police their sovereign waters.

Historically, the response to piracy and illegal fishing was largely fragmented. Individual nations attempted to secure their own territorial waters with limited naval assets, often resulting in maritime criminals simply slipping across invisible maritime borders to evade capture. This disjointed approach meant that while localized patrols might temporarily suppress threats in one sector, the overall regional risk remained unacceptably high, driving up insurance premiums for commercial vessels and severely impacting local economies.

In recent years, there has been a profound strategic shift toward unified regional architecture. The Yaoundé Code of Conduct marked a turning point, establishing a framework for intelligence sharing and joint naval operations across multiple jurisdictions. By integrating surveillance networks and committing to cross-border pursuit agreements, West African navies have moved from reactive policing to proactive deterrence, demonstrating that institutional cooperation is the ultimate antidote to maritime instability.";

echo "Testing AI Engine...\n";
$time_start = microtime(true);
$seo_data = $ai_engine->generate_seo_metadata($content);
$time_end = microtime(true);
$execution_time = ($time_end - $time_start);

echo "Execution time: {$execution_time} seconds\n";
echo "Result:\n";
print_r($seo_data);
