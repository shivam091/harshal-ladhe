export interface Post {
  id: number;
  title: string;
}

export interface ApiResult {
  status: number;
  body: unknown;
}

// Stands in for the in-memory data a real route.ts would usually read from a database instead.
const posts: Post[] = [
  { id: 1, title: "Hello World" },
  { id: 2, title: "Route Handlers Explained" },
];

// Mirrors GET /api/posts — a route.ts file's exported `GET` function, given the whole collection.
export function handleGetPosts(): ApiResult {
  return { status: 200, body: posts };
}

// Mirrors GET /api/posts/[id] — the dynamic segment arrives as a real path param, not a query string.
export function handleGetPost(id: number): ApiResult {
  const post = posts.find((p) => p.id === id);
  if (!post) return { status: 404, body: { error: `Post ${id} not found` } };
  return { status: 200, body: post };
}

// Mirrors POST /api/posts — parses a JSON body and validates it before "writing" it.
export function handleCreatePost(rawBody: string): ApiResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: "Invalid JSON body" } };
  }

  const title = (parsed as { title?: unknown }).title;
  if (typeof title !== "string" || title.trim() === "") {
    return { status: 400, body: { error: "title is required" } };
  }

  const created: Post = { id: posts.length + 1, title };
  posts.push(created);
  return { status: 201, body: created };
}
