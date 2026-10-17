"use client";

export function ConfirmButton({ label, message }: { label: string; message: string }) {
  return (
    <button
      type="submit"
      className="min-h-11 rounded-full border border-border px-4"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
