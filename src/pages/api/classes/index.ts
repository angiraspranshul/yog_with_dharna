import type { APIRoute } from "astro";
import { adminDb, adminAuth } from "../../../lib/firebase/admin";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verify admin
    const sessionCookie = cookies.get("session")?.value;
    if (!sessionCookie) return new Response("Unauthorized", { status: 401 });
    await adminAuth.verifySessionCookie(sessionCookie, true);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const duration = formData.get("duration") as string;
    const level = formData.get("level") as string;
    const desc = formData.get("desc") as string;
    const imgUrl = (formData.get("imageUrl") as string) || "";

    if (!name || !price || !duration || !level || !desc) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Save to Firestore
    const classData: Record<string, any> = {
      name,
      price,
      duration,
      level,
      desc,
      img: imgUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("classes").add(classData);

    return new Response(JSON.stringify({ id: docRef.id, success: true }), { status: 200 });
  } catch (error) {
    console.error("Error creating class:", error);
    return new Response(JSON.stringify({ error: "Failed to create class" }), { status: 500 });
  }
};
