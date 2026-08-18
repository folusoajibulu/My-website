<?php
/**
 * Plugin Name: Headless AI Commerce Core
 * Description: Universal headless routing, Next.js webhook automation, and Gemini AI-powered SEO metadata engine.
 * Version: 3.0.0
 * Author: Yusuf Abubakar Saka
 * License: GPL2
 */

if ( ! defined( 'ABSOLUTE_PATH' ) && ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define Plugin Constants
define( 'HAIC_VERSION', '3.0.0' );
define( 'HAIC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'HAIC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Main Plugin Class
 * Orchestrates the loading of all specialized modules.
 */
class Headless_AI_Commerce_Core_Plugin {

    public function __construct() {
        $this->load_dependencies();
        $this->init_modules();
    }

    /**
     * Load all required module files.
     */
    private function load_dependencies() {
        require_once HAIC_PLUGIN_DIR . 'inc/class-settings.php';
        require_once HAIC_PLUGIN_DIR . 'inc/class-routing.php';
        require_once HAIC_PLUGIN_DIR . 'inc/class-automation.php';
        require_once HAIC_PLUGIN_DIR . 'inc/class-ai-engine.php';
        require_once HAIC_PLUGIN_DIR . 'inc/class-seo.php';
    }

    /**
     * Initialize the modules.
     */
    private function init_modules() {
        // Core Utilities
        $settings = new HAIC_Settings();
        
        // Infrastructure
        new HAIC_Routing( $settings );
        
        // AI & SEO
        $ai_engine = new HAIC_AI_Engine( $settings );
        new HAIC_SEO( $ai_engine );
        
        // Automation / Next.js Webhooks
        new HAIC_Automation( $settings );
    }
}

// Boot the plugin
function run_headless_ai_commerce_core() {
    new Headless_AI_Commerce_Core_Plugin();
}
run_headless_ai_commerce_core();
