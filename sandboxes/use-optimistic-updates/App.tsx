import { startTransition, useOptimistic, useState } from "react";
import type { FormEvent } from "react";
import { postComment } from "./comments";
import type { Comment } from "./comments";
import "./styles.css";

const INITIAL_COMMENTS: Comment[] = [{ id: "seed-1", text: "First comment — already saved." }];

export default function App() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // optimisticComments always renders instantly; it reverts to `comments` on its own once the transition that added a pending entry finishes.
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, (state, newComment: Comment) => [
    ...state,
    newComment
  ]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const submittedText = text;
    setText("");
    setError(null);

    startTransition(async () => {
      addOptimisticComment({ id: `pending-${Date.now()}`, text: submittedText, pending: true });
      try {
        const saved = await postComment(submittedText);
        setComments((prev) => [...prev, saved]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Instant Feedback with useOptimistic</h1>
        <p className="subtitle">Every comment appears immediately, dimmed while pending — about a third of posts fail and roll back on their own.</p>

        <ul className="comments">
          {optimisticComments.map((comment) => (
            <li key={comment.id} className={comment.pending ? "comment pending" : "comment"}>
              {comment.text}
              {comment.pending && <span className="pending-label">sending…</span>}
            </li>
          ))}
        </ul>

        {error && <p className="error">{error}</p>}

        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            className="comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
          />
          <button className="submit-btn" type="submit">
            Post
          </button>
        </form>
      </div>
    </>
  );
}
