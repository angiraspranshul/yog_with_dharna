import type { APIRoute } from "astro";
import { adminAuth } from "../../../lib/firebase/admin";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { idToken } = await request.json();

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie
    cookies.set("session", sessionCookie, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge: expiresIn / 1000, // maxAge is in seconds for Astro cookies
      sameSite: "lax",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Login API Error:", error);
    return new Response(JSON.stringify({ error: "Invalid login" }), { status: 401 });
  }
};
