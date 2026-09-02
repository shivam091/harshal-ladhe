import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import "./styles.css";

interface FormState {
  message: string;
}

async function saveProfile(_previousState: FormState, formData: FormData): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const displayName = String(formData.get("displayName") ?? "");
  return { message: `Profile saved for ${displayName}.` };
}

// Reads the nearest enclosing <form>'s pending state directly — no props passed from a parent.
function PendingBanner() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return <div className="pending-banner">Saving your changes…</div>;
}

// A second, independent consumer of the SAME form's status — no coordination with PendingBanner.
function FieldsetLock({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <fieldset className="fieldset" disabled={pending}>
      {children}
    </fieldset>
  );
}

// A third independent consumer — the submit button's own label/disabled state.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="submit-btn">
      {pending ? "Saving…" : "Save Profile"}
    </button>
  );
}

export default function App() {
  const [state, formAction] = useActionState<FormState, FormData>(saveProfile, { message: "" });

  return (
    <>
      <div className="wrapper">
        <h1 className="title">useFormStatus in Nested Components</h1>
        <p className="subtitle">
          Three separate components — a banner, a fieldset, and the submit button — each call useFormStatus()
          independently. No props passed between them.
        </p>

        <form action={formAction} className="profile-form">
          <PendingBanner />

          <FieldsetLock>
            <label className="field">
              Display name
              <input type="text" name="displayName" defaultValue="Ada Lovelace" />
            </label>
            <label className="field">
              Bio
              <input type="text" name="bio" defaultValue="Mathematician" />
            </label>
          </FieldsetLock>

          <SubmitButton />
        </form>

        {state.message && <p className="result-message">{state.message}</p>}
      </div>
    </>
  );
}
