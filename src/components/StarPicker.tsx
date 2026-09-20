"use client";

import { useState } from "react";

type StarPickerProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  allowClear?: boolean;
  ariaLabel?: string;
};

export function StarPicker({
  value,
  onChange,
  size = 30,
  allowClear = false,
  ariaLabel,
}: StarPickerProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = hover ? n <= hover : n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(allowClear && value === n ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${ariaLabel ? `${ariaLabel}: ` : ""}${n} star${n > 1 ? "s" : ""}`}
            className={`leading-none transition-colors ${
              active ? "text-star" : "text-neutral-300 dark:text-neutral-700"
            }`}
            style={{ fontSize: size }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
