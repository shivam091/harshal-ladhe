import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import "./styles.css";

interface FormState {
  status: "idle" | "success" | "error";
  message: string;
}

// Stands in for a real Server Action — in Next.js this function would live in its own file
// marked "use server" and run only on the server. Here it's mocked with an artificial delay so
// the pending state (below) has something to show.
async function subscribe(_previousState: FormState, formData: FormData): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const email = String(formData.get("email") ?? "");
  if (!email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  return { status: "success", message: `Subscribed ${email}!` };
}

// Must be a descendant of the <form> — useFormStatus reads the nearest enclosing form's state.
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="submit-btn">
      {pending ? "Submitting…" : "Subscribe"}
    </button>
  );
}

export default function App() {
  const [state, formAction] = useActionState<FormState, FormData>(subscribe, { status: "idle", message: "" });

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Form Actions</h1>
        <p className="subtitle">A real &lt;form&gt; posting through an action — try an invalid email, then a valid one.</p>

        <form action={formAction} className="subscribe-form">
          <input type="email" name="email" placeholder="you@example.com" className="email-input" />
          <SubmitButton />
        </form>

        {state.status !== "idle" && <p className={`form-message ${state.status}`}>{state.message}</p>}
      </div>
    </>
  );
}
