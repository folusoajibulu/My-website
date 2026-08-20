import { Metadata } from "next";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login — Foluso Ajibulu",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const wpUrl = (process.env.WORDPRESS_API_URL || "https://blog.folusoajibulu.com").replace(/\/$/, "");
  // Use VERCEL_PROJECT_PRODUCTION_URL if available, otherwise fallback to localhost for dev
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
  
  const params = await searchParams;
  const error = params?.error === "1";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-navy">Author Login</h1>
          <p className="mt-2 text-sm text-navy/60">
            Secure access to the publishing portal.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-600">
            Incorrect username or password. Please try again.
          </div>
        )}

        <form
          className="space-y-6"
          action={`${wpUrl}/wp-login.php`}
          method="POST"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="user_login"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-navy/70"
              >
                Username or Email
              </label>
              <input
                id="user_login"
                name="log"
                type="text"
                autoCapitalize="off"
                autoComplete="username"
                required
                className="w-full rounded-none border-b border-navy/20 bg-transparent py-3 text-navy placeholder-navy/30 transition-colors focus:border-navy focus:outline-none focus:ring-0"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="user_pass"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-navy/70"
              >
                Password
              </label>
              <input
                id="user_pass"
                name="pwd"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-none border-b border-navy/20 bg-transparent py-3 text-navy placeholder-navy/30 transition-colors focus:border-navy focus:outline-none focus:ring-0"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="rememberme"
                name="rememberme"
                type="checkbox"
                value="forever"
                className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
              />
              <label htmlFor="rememberme" className="ml-2 block text-sm text-navy/70">
                Remember me
              </label>
            </div>
          </div>

          <input type="hidden" name="redirect_to" value={`${wpUrl}/wp-admin/admin.php?page=haic-publisher`} />
          <input type="hidden" name="custom_error_redirect" value={`${baseUrl}/admin?error=1`} />
          {/* Note: Deliberately omitting testcookie so WP doesn't throw a "Cookies are blocked" error for cross-domain POSTs */}

          <button
            type="submit"
            className="w-full rounded-full bg-navy px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-navy/90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
