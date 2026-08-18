<?php
/**
 * Publisher UI Module
 * Creates a simplified, white-labeled dashboard for non-admin authors.
 */

class HAIC_Publisher_UI {
    private $settings;

    public function __construct( HAIC_Settings $settings ) {
        $this->settings = $settings;
        add_action( 'admin_init', [ $this, 'intercept_non_admins' ] );
        add_action( 'admin_menu', [ $this, 'register_publisher_menu' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_publisher_assets' ] );
        add_action( 'admin_post_haic_publish_post', [ $this, 'handle_form_submission' ] );
        add_action( 'admin_post_haic_delete_post', [ $this, 'handle_delete_post' ] );
    }

    public function intercept_non_admins() {
        if ( current_user_can( 'manage_options' ) ) return;

        if ( current_user_can( 'edit_posts' ) ) {
            global $pagenow;
            if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) return;
            if ( $pagenow === 'admin-post.php' ) return;

            if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'haic-publisher' ) {
                wp_redirect( admin_url( 'admin.php?page=haic-publisher' ) );
                exit;
            }
        }
    }

    public function register_publisher_menu() {
        if ( current_user_can( 'manage_options' ) ) return;

        if ( current_user_can( 'edit_posts' ) ) {
            global $menu;
            $menu = [];

            add_menu_page(
                'Publications',
                'Publications',
                'edit_posts',
                'haic-publisher',
                [ $this, 'render_publisher_dashboard' ],
                'dashicons-edit',
                1
            );
        }
    }

    public function enqueue_publisher_assets( $hook ) {
        if ( $hook !== 'toplevel_page_haic-publisher' ) return;

        wp_enqueue_media();
        wp_enqueue_style( 'haic-publisher-css', HAIC_PLUGIN_URL . 'assets/css/publisher.css', [], HAIC_VERSION );
        wp_enqueue_script( 'haic-publisher-js', HAIC_PLUGIN_URL . 'assets/js/publisher.js', [ 'jquery' ], HAIC_VERSION, true );
    }

    public function render_publisher_dashboard() {
        $view = isset( $_GET['view'] ) ? sanitize_text_field( $_GET['view'] ) : 'dashboard';

        echo '<div class="haic-publisher-wrap">';
        
        $this->render_top_nav();

        if ( $view === 'dashboard' ) {
            $this->render_dashboard_view();
        } elseif ( $view === 'editor' ) {
            $this->render_editor_view();
        }

        echo '</div>';
    }

    private function render_top_nav() {
        $current_user = wp_get_current_user();
        ?>
        <div class="haic-top-nav">
            <div class="haic-user-greeting">
                Hello, <strong><?php echo esc_html( $current_user->display_name ); ?></strong>
            </div>
            <div class="haic-nav-actions">
                <a href="<?php echo esc_url( wp_logout_url() ); ?>" class="haic-text-link">Log Out</a>
            </div>
        </div>
        <?php
    }

    private function render_dashboard_view() {
        $user_id = get_current_user_id();
        
        $search_query = isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : '';
        $cat_filter   = isset( $_GET['cat'] ) ? intval( $_GET['cat'] ) : 0;

        $args = [
            'author'      => $user_id,
            'post_status' => ['publish', 'draft'],
            'numberposts' => 20,
            's'           => $search_query,
        ];

        if ( $cat_filter > 0 ) {
            $args['category'] = $cat_filter;
        }

        $recent_posts = get_posts( $args );
        $categories = get_categories( [ 'hide_empty' => false ] );

        ?>
        <div class="haic-header">
            <h1>My Publications</h1>
            <a href="?page=haic-publisher&view=editor" class="haic-btn haic-btn-primary">Write New Publication</a>
        </div>

        <?php if ( isset( $_GET['success'] ) ) : ?>
            <div class="haic-alert haic-alert-success" id="haic-success-alert">
                Publication saved successfully! It is now syncing to the live website.
            </div>
        <?php elseif ( isset( $_GET['deleted'] ) ) : ?>
            <div class="haic-alert haic-alert-success" id="haic-success-alert">
                Publication was successfully deleted.
            </div>
        <?php endif; ?>

        <div class="haic-toolbar">
            <form method="get" action="">
                <input type="hidden" name="page" value="haic-publisher">
                <input type="text" name="s" placeholder="Search publications..." value="<?php echo esc_attr( $search_query ); ?>" class="haic-search-input">
                <select name="cat" class="haic-filter-select">
                    <option value="0">All Categories</option>
                    <?php foreach ( $categories as $category ) : ?>
                        <option value="<?php echo esc_attr( $category->term_id ); ?>" <?php selected( $cat_filter, $category->term_id ); ?>>
                            <?php echo esc_html( $category->name ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" class="haic-btn haic-btn-secondary">Filter</button>
                <?php if ( ! empty( $search_query ) || $cat_filter > 0 ) : ?>
                    <a href="?page=haic-publisher" class="haic-text-link" style="margin-left: 10px;">Clear</a>
                <?php endif; ?>
            </form>
        </div>

        <div class="haic-card">
            <?php if ( empty( $recent_posts ) ) : ?>
                <p>No publications found.</p>
            <?php else : ?>
                <ul class="haic-post-list">
                    <?php foreach ( $recent_posts as $post ) : 
                        $cats = get_the_category( $post->ID );
                        $cat_name = ! empty( $cats ) ? $cats[0]->name : 'Uncategorized';
                        $edit_url = admin_url( 'admin.php?page=haic-publisher&view=editor&post=' . $post->ID );
                        
                        $wp_url = get_permalink( $post->ID );
                        $frontend_url = rtrim( $this->settings->get_frontend_url(), '/' );
                        // Force Next.js format: /commentary/[slug]
                        $live_url = $frontend_url . '/commentary/' . $post->post_name;
                        $delete_url = wp_nonce_url( admin_url( 'admin-post.php?action=haic_delete_post&post=' . $post->ID ), 'haic_delete_' . $post->ID );
                    ?>
                        <li>
                            <div class="haic-post-info">
                                <a href="<?php echo esc_url( $edit_url ); ?>" class="haic-post-title-link">
                                    <strong><?php echo esc_html( $post->post_title ); ?></strong>
                                </a>
                                <div class="haic-post-meta">
                                    <span class="haic-status haic-status-<?php echo esc_attr( $post->post_status ); ?>"><?php echo esc_html( ucfirst( $post->post_status ) ); ?></span>
                                    <span class="haic-category-badge"><?php echo esc_html( $cat_name ); ?></span>
                                </div>
                            </div>
                            <div class="haic-post-actions">
                                <span class="haic-post-date"><?php echo esc_html( get_the_date( '', $post ) ); ?></span>
                                <?php if ( $post->post_status === 'publish' && ! empty( $frontend_url ) ) : ?>
                                    <a href="<?php echo esc_url( $live_url ); ?>" target="_blank" class="haic-btn haic-btn-sm haic-btn-outline" title="View on live website">View Live</a>
                                <?php endif; ?>
                                <a href="<?php echo esc_url( $edit_url ); ?>" class="haic-btn haic-btn-sm haic-btn-secondary">Edit</a>
                                <a href="<?php echo esc_url( $delete_url ); ?>" class="haic-text-link haic-text-danger" onclick="return confirm('Are you sure you want to delete this publication?');" title="Delete">Delete</a>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        <?php
    }

    private function render_editor_view() {
        $categories = get_categories( [ 'hide_empty' => false ] );
        
        $post_id = isset( $_GET['post'] ) ? intval( $_GET['post'] ) : 0;
        $is_edit = $post_id > 0;
        
        $title = '';
        $content = '';
        $current_cat = 0;
        $image_id = 0;
        $image_url = '';

        if ( $is_edit ) {
            $post = get_post( $post_id );
            // Security check to ensure they own the post
            if ( $post && $post->post_author == get_current_user_id() ) {
                $title = $post->post_title;
                $content = $post->post_content;
                
                $cats = get_the_category( $post_id );
                if ( ! empty( $cats ) ) $current_cat = $cats[0]->term_id;

                $image_id = get_post_thumbnail_id( $post_id );
                if ( $image_id ) {
                    $image_url = wp_get_attachment_image_url( $image_id, 'medium' );
                }
            } else {
                echo '<div class="haic-alert">Invalid post or unauthorized.</div>';
                return;
            }
        }

        ?>
        <div class="haic-header">
            <h1><?php echo $is_edit ? 'Edit Publication' : 'New Publication'; ?></h1>
            <a href="?page=haic-publisher" class="haic-btn haic-btn-secondary">Cancel</a>
        </div>

        <div class="haic-editor-container">
            <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                <input type="hidden" name="action" value="haic_publish_post">
                <input type="hidden" name="haic_post_id" value="<?php echo esc_attr( $post_id ); ?>">
                <?php wp_nonce_field( 'haic_publish_nonce', 'haic_nonce' ); ?>

                <div class="haic-main-column">
                    <div class="haic-form-group">
                        <input type="text" name="post_title" class="haic-input-title" placeholder="Publication Title" value="<?php echo esc_attr( $title ); ?>" required>
                    </div>

                    <div class="haic-form-group">
                        <?php 
                        wp_editor( $content, 'post_content', [
                            'textarea_name' => 'post_content',
                            'textarea_rows' => 25,
                            'media_buttons' => true,
                            'teeny'         => false,
                            'quicktags'     => true
                        ] ); 
                        ?>
                    </div>
                </div>

                <div class="haic-sidebar-column">
                    <div class="haic-card">
                        <h3>Category</h3>
                        <select name="post_category" class="haic-select">
                            <?php foreach ( $categories as $category ) : ?>
                                <option value="<?php echo esc_attr( $category->term_id ); ?>" <?php selected( $current_cat, $category->term_id ); ?>>
                                    <?php echo esc_html( $category->name ); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="haic-card">
                        <h3>Featured Image</h3>
                        <div class="haic-image-preview" id="haic-image-preview">
                            <?php if ( $image_url ) : ?>
                                <img src="<?php echo esc_url( $image_url ); ?>" alt="Preview">
                            <?php else : ?>
                                <p>No image selected</p>
                            <?php endif; ?>
                        </div>
                        <input type="hidden" name="featured_image_id" id="haic-featured-image-id" value="<?php echo esc_attr( $image_id ); ?>">
                        <button type="button" class="haic-btn haic-btn-secondary haic-btn-block" id="haic-upload-image-btn"><?php echo $image_id ? 'Change Image' : 'Select Image'; ?></button>
                    </div>

                    <div class="haic-card haic-publish-card">
                        <h3>Publish</h3>
                        <p class="haic-meta-desc">Clicking below will immediately sync this publication to the live website.</p>
                        <button type="submit" class="haic-btn haic-btn-primary haic-btn-block haic-btn-lg">
                            <?php echo $is_edit ? 'Update Publication' : 'Publish Now'; ?>
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <?php
    }

    public function handle_form_submission() {
        if ( ! current_user_can( 'edit_posts' ) ) wp_die( 'Unauthorized' );
        if ( ! isset( $_POST['haic_nonce'] ) || ! wp_verify_nonce( $_POST['haic_nonce'], 'haic_publish_nonce' ) ) wp_die( 'Security check failed' );

        $post_id  = isset( $_POST['haic_post_id'] ) ? intval( $_POST['haic_post_id'] ) : 0;
        $title    = isset( $_POST['post_title'] ) ? sanitize_text_field( $_POST['post_title'] ) : '';
        $content  = isset( $_POST['post_content'] ) ? wp_kses_post( wp_unslash( $_POST['post_content'] ) ) : '';
        $category = isset( $_POST['post_category'] ) ? intval( $_POST['post_category'] ) : 0;
        $image_id = isset( $_POST['featured_image_id'] ) ? intval( $_POST['featured_image_id'] ) : 0;

        if ( empty( $title ) ) wp_die( 'Title is required' );

        $post_data = [
            'post_title'    => $title,
            'post_content'  => $content,
            'post_status'   => 'publish',
            'post_author'   => get_current_user_id(),
            'post_category' => [ $category ]
        ];

        // If editing, append ID
        if ( $post_id > 0 ) {
            $post_data['ID'] = $post_id;
        }

        $saved_id = wp_insert_post( $post_data );

        if ( ! is_wp_error( $saved_id ) ) {
            if ( $image_id > 0 ) {
                set_post_thumbnail( $saved_id, $image_id );
            } else {
                delete_post_thumbnail( $saved_id );
            }
        }

        wp_redirect( admin_url( 'admin.php?page=haic-publisher&success=1' ) );
        exit;
    }

    public function handle_delete_post() {
        if ( ! current_user_can( 'edit_posts' ) ) wp_die( 'Unauthorized' );
        
        $post_id = isset( $_GET['post'] ) ? intval( $_GET['post'] ) : 0;
        if ( ! wp_verify_nonce( $_GET['_wpnonce'], 'haic_delete_' . $post_id ) ) wp_die( 'Security check failed' );

        $post = get_post( $post_id );
        // Ensure they own the post before trashing it
        if ( $post && $post->post_author == get_current_user_id() ) {
            wp_trash_post( $post_id );
        }

        wp_redirect( admin_url( 'admin.php?page=haic-publisher&deleted=1' ) );
        exit;
    }
}
