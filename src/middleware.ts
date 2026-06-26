import { defineMiddleware } from 'astro:middleware';
import { adminAuth } from './lib/firebase/admin';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  // Only protect routes under /admin
  if (url.pathname.startsWith('/admin')) {
    const sessionCookie = cookies.get('session')?.value;
    let isAuthenticated = false;

    if (sessionCookie) {
      try {
        await adminAuth.verifySessionCookie(sessionCookie, true);
        isAuthenticated = true;
      } catch (error) {
        console.error("Invalid session cookie:", error);
      }
    }

    if (!isAuthenticated) {
      // Redirect unauthenticated users to the login page
      return redirect('/login');
    }
  }

  // Continue to the next handler/page
  return next();
});
