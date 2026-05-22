"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCard } from "@/app/actions/cards";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCard(cardId);
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="cursor-pointer rounded-md bg-rose-600 px-2 py-1 text-[0.6875rem] font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          {isPending ? "…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="cursor-pointer rounded-md border border-stone-200 px-2 py-1 text-[0.6875rem] font-semibold text-stone-600 transition-colors hover:bg-stone-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Delete card"
      onClick={() => setConfirming(true)}
      className="cursor-pointer rounded-md p-1.5 text-stone-400 opacity-0 transition-all duration-150 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
    >
      <Trash2 className="h-4 w-4" aria-hidden />
    </button>
  );
}
