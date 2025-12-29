import dummyPosts from "../../../dummy/dummyPosts";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URL!);

export async function GET(request: Request) {
  const posts = dummyPosts;

  return Response.json({ posts });
}

export async function POST(request: Request) {
  const { content } = await request.json();
  try {
    const newPost = {
      id: 123123,
      content,
      user_id: "user_id",
    };

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,
    });
  }
}
