import dummyPosts from "../../../dummy/dummyPosts";

export function GET(request: Request, { id }: { id: string }) {
  const post = dummyPosts.find((post) => post.id === Number(id));

  if (!post) {
    return new Response("Post not found", {
      status: 404,
    });
  }

  return Response.json({ post });
}

export async function DELETE(request: Request, { id }: { id: string }) {
  return new Response("Not implemented");
}

export async function PATCH(request: Request, { id }: { id: string }) {
  return new Response("Not implemented");
}
