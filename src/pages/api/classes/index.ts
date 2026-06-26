import type { APIRoute } from "astro";
import { adminDb, adminAuth, adminBucket } from "../../../lib/firebase/admin";

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
    const imageFile = formData.get("image") as File | null;

    if (!name || !price || !duration || !level || !desc) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    let imgUrl = "";

    if (imageFile && imageFile.size > 0) {
      // Upload image to Firebase Storage via Admin SDK
      const ext = imageFile.name.split(".").pop() || "jpg";
      const fileName = `classes/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const file = adminBucket.file(fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      await file.save(buffer, {
        metadata: { contentType: imageFile.type },
      });

      // Make the file publicly readable
      await file.makePublic();
      imgUrl = `https://storage.googleapis.com/${adminBucket.name}/${fileName}`;
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
