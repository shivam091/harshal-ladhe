"use client";

import { useCallback, useState } from "react";

type Updater<T> = T | ((prev: T) => T);

function resolve<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
}

export interface UseUndoStackResult<T> {
  state: T;
  // Updates the present value WITHOUT recording a history entry — for continuous, high-frequency changes (a live pointer drag) where every intermediate frame shouldn't become its own undo step.
  setPresent: (updater: Updater<T>) => void;
  // Snapshots the state from BEFORE the current run of setPresent calls (or, if none happened, the current present) onto the undo stack, then applies `updater` (or, called with no argument, just checkpoints — the hook a drag's pointerup uses after a run of setPresent calls). The one mechanism every discrete edit or completed drag goes through to create an undo step.
  commit: (updater?: Updater<T>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Replaces the present and clears all history — for loading a permalink, where the restored state shouldn't be undoable back into whatever was on screen before it.
  reset: (next: T) => void;
}

/*
  Generic undo/redo stack with no precedent elsewhere in this codebase to mirror. past/future/
  pendingBaseline are plain state (not refs): canUndo/canRedo are read directly during render (the
  react-hooks/refs rule disallows that for ref.current), and pendingBaseline is read from inside
  other callbacks' closures rather than mutated as a side effect of a setState updater, which the
  same purity rule disallows for refs.

  pendingBaseline solves a specific problem a plain "push current state on commit" can't: during a
  drag, setPresent is called many times BEFORE commit ever runs, so by the time commit() fires (on
  pointerup), `state` already IS the post-drag value — pushing "current state" at that point would
  make undo a no-op. pendingBaseline instead captures state as it was on the FIRST setPresent call
  of a gesture and holds it there (untouched by every later setPresent call in the same gesture)
  until commit reads and clears it — collapsing an entire drag into one correct undo step.
*/
export function useUndoStack<T>(initial: T | (() => T)): UseUndoStackResult<T> {
  const [state, setState] = useState<T>(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const [pendingBaseline, setPendingBaseline] = useState<T | null>(null);

  const setPresent = useCallback(
    (updater: Updater<T>) => {
      setPendingBaseline((current) => current ?? state);
      setState((prev) => resolve(updater, prev));
    },
    [state]
  );

  const commit = useCallback(
    (updater?: Updater<T>) => {
      setPast((p) => [...p, pendingBaseline ?? state]);
      setFuture([]);
      setPendingBaseline(null);
      if (updater !== undefined) setState((prev) => resolve(updater, prev));
    },
    [state, pendingBaseline]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [state, ...f]);
    setPendingBaseline(null);
    setState(previous);
  }, [past, state]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setPast((p) => [...p, state]);
    setPendingBaseline(null);
    setState(next);
  }, [future, state]);

  const reset = useCallback((next: T) => {
    setPast([]);
    setFuture([]);
    setPendingBaseline(null);
    setState(next);
  }, []);

  return { state, setPresent, commit, undo, redo, reset, canUndo: past.length > 0, canRedo: future.length > 0 };
}
