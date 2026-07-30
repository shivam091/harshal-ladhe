// A post's like counter as persisted in the database — one document per post slug.
export type Like = {
  // The post path (e.g. "/post/my-post"). Also used as the document `_id`.
  slug: string;
  // Total number of likes recorded for this post.
  likeCount: number;
  // When this slug was first liked.
  createdAt: Date;
  // When this slug was last liked.
  updatedAt: Date;
};
