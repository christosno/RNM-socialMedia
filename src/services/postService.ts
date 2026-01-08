export async function getPosts(
  pageParam: { limit: number; cursor: number | undefined },
  token: string
) {
  const searchParams = new URLSearchParams();

  if (pageParam.cursor) {
    searchParams.set("cursor", pageParam.cursor.toString());
  }
  if (pageParam.limit) {
    searchParams.set("limit", pageParam.limit.toString());
  }

  const url = `/api/posts?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data.posts;
}

export async function getPost(id: string, token: string) {
  const response = await fetch(`/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    throw new Error("Post not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}

type CreatePostInput = { content: string };
export async function createPostRequest(post: CreatePostInput, token: string) {
  const response = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

export async function likePostRequest(id: number, token: string) {
  const response = await fetch(`/api/posts/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  return await response.json();
}

export async function unlikePostRequest(id: number, token: string) {
  const response = await fetch(`/api/posts/${id}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to unlike post");
  }

  return true;
}
