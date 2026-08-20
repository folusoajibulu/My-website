/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Read the WordPress URL from env, or default to the known one
    let wpUrl = process.env.WORDPRESS_API_URL || 'https://blog.folusoajibulu.com';
    // Remove trailing slash if present
    wpUrl = wpUrl.replace(/\/$/, '');
    
    // URL encode the destination we want after login
    // This points to the custom publisher UI we built
    const redirectDestination = encodeURIComponent(`${wpUrl}/wp-admin/admin.php?page=haic-publisher`);
    
    return [
      {
        source: '/admin',
        destination: `${wpUrl}/wp-login.php?redirect_to=${redirectDestination}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
