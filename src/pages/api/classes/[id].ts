import type { APIRoute } from "astro";
import { adminDb, adminAuth, adminBucket } from "../../../lib/firebase/admin";

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Verify admin
    const sessionCookie = cookies.get("session")?.value;
    if (!sessionCookie) return new Response("Unauthorized", { status: 401 });
    await adminAuth.verifySessionCookie(sessionCookie, true);

    const id = params.id;
    if (!id) return new Response("Missing ID", { status: 400 });

    // Get the class data first to find the image path
    const doc = await adminDb.collection("classes").doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      // Delete image from Storage if it exists
      if (data?.img && data.img.includes("storage.googleapis.com")) {
        try {
          const bucketName = adminBucket.name;
          const filePath = data.img.split(`${bucketName}/`)[1];
          if (filePath) {
            await adminBucket.file(filePath).delete();
          }
        } catch (storageErr) {
          console.error("Error deleting image from storage:", storageErr);
          // Continue with Firestore deletion even if Storage deletion fails
        }
      }
    }

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
    const imageFile = formData.get("image") as File | null;

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

    if (imageFile && imageFile.size > 0) {
      // Get old image to delete
      const doc = await adminDb.collection("classes").doc(id).get();
      if (doc.exists) {
        const oldData = doc.data();
        if (oldData?.img && oldData.img.includes("storage.googleapis.com")) {
          try {
            const bucketName = adminBucket.name;
            const filePath = oldData.img.split(`${bucketName}/`)[1];
            if (filePath) await adminBucket.file(filePath).delete();
          } catch (storageErr) {
            console.error("Error deleting old image:", storageErr);
          }
        }
      }

      // Upload new image
      const ext = imageFile.name.split(".").pop() || "jpg";
      const fileName = `classes/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const file = adminBucket.file(fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      await file.save(buffer, { metadata: { contentType: imageFile.type } });
      await file.makePublic();
      classData.img = `https://storage.googleapis.com/${adminBucket.name}/${fileName}`;
    }

    await adminDb.collection("classes").doc(id).update(classData);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);
    return new Response(JSON.stringify({ error: "Failed to update class" }), { status: 500 });
  }
};
