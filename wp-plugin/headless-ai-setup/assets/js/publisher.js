jQuery(document).ready(function($) {
    // 1. Clean up success/deleted message from URL so it doesn't persist on refresh
    if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        var changed = false;
        if (url.searchParams.has('success')) {
            url.searchParams.delete('success');
            changed = true;
        }
        if (url.searchParams.has('deleted')) {
            url.searchParams.delete('deleted');
            changed = true;
        }
        
        if (changed) {
            window.history.replaceState({ path: url.href }, '', url.href);
            
            // Auto fade out alert after 5 seconds
            setTimeout(function() {
                $('#haic-success-alert').fadeOut('slow');
                $('#haic-deleted-alert').fadeOut('slow');
            }, 5000);
        }
    }

    // 2. Media Uploader Logic
    var mediaUploader;
    $('#haic-upload-image-btn').on('click', function(e) {
        e.preventDefault();

        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        mediaUploader = wp.media.frames.file_frame = wp.media({
            title: 'Choose Featured Image',
            button: { text: 'Choose Image' },
            multiple: false
        });

        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#haic-featured-image-id').val(attachment.id);
            $('#haic-image-preview').html('<img src="' + attachment.url + '" alt="Preview">');
            $('#haic-upload-image-btn').text('Change Image');
        });

        mediaUploader.open();
    });
});
