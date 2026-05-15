"use client";

import { useEffect, useState } from "react";
import type { TeamActionState } from "@/app/types/team";

type TeamActionFeedbackProps = {
  state: TeamActionState;
};

export default function TeamActionFeedback({ state }: TeamActionFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.message) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.message]);

  if (!state.message || !visible) {
    return null;
  }

  return (
    <div
      className={`fixed right-6 top-6 z-[100] max-w-sm rounded-2xl border px-4 py-3 shadow-[var(--shadow-lg)] backdrop-blur-xl ${
        state.ok
          ? "border-emerald-200 bg-white text-emerald-700"
          : "border-red-200 bg-white text-red-600"
      }`}
    >
      <p className="text-sm font-semibold">
        {state.ok ? "Success" : "Action blocked"}
      </p>

      <p className="mt-1 text-sm">{state.message}</p>
    </div>
  );
}