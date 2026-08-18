import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    // Make sure we have a secret configured locally
    if (!process.env.REVALIDATION_SECRET) {
      console.warn("REVALIDATION_SECRET is not set in the environment variables.");
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // Check if the secret matches
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Revalidation triggered for post:', body.slug || body.post_id);

    // Revalidate the 'wordpress' tag which clears the cache for our getPosts and getPostBySlug fetches
    revalidateTag('wordpress');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error during revalidation:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
