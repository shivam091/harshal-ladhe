// One saved (or in-flight) comment in the demo's list.
export interface Comment {
  id: string;
  text: string;
  pending?: boolean;
}

let nextId = 1;

/*
  Stands in for a real server action — resolves with a "saved" comment after a delay, or rejects
  about a third of the time so the demo can show the optimistic entry roll back on failure.
*/
export function postComment(text: string): Promise<Comment> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.33) {
        reject(new Error("Network error — comment not saved"));
        return;
      }
      resolve({ id: `saved-${nextId++}`, text });
    }, 1200);
  });
}
