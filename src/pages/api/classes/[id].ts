import type { APIRoute } from "astro";
import { adminDb, adminAuth } from "../../../lib/firebase/admin";

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Verify admin
    const sessionCookie = cookies.get("session")?.value;
    if (!sessionCookie) return new Response("Unauthorized", { status: 401 });
    await adminAuth.verifySessionCookie(sessionCookie, true);

    const id = params.id;
    if (!id) return new Response("Missing ID", { status: 400 });

    // Delete from Firestore
    await adminDb.collection("classes").doc(id).delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return new Response(JSON.stringify({ error: "Failed to delete class" }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, params, cookies }) => {
  try {
    // Verify admin
    const sessionCookie = cookies.get("session")?.value;
    if (!sessionCookie) return new Response("Unauthorized", { status: 401 });
    await adminAuth.verifySessionCookie(sessionCookie, true);

    const id = params.id;
    if (!id) return new Response("Missing ID", { status: 400 });

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const duration = formData.get("duration") as string;
    const level = formData.get("level") as string;
    const desc = formData.get("desc") as string;
    const imgUrl = formData.get("imageUrl") as string;

    if (!name || !price || !duration || !level || !desc) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const classData: Record<string, any> = {
      name,
      price,
      duration,
      level,
      desc,
      updatedAt: new Date().toISOString(),
    };

    // Only update image if a new URL was provided
    if (imgUrl) {
      classData.img = imgUrl;
    }

    await adminDb.collection("classes").doc(id).update(classData);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);
    return new Response(JSON.stringify({ error: "Failed to update class" }), { status: 500 });
  }
};
