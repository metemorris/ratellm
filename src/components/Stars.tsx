type StarsProps = {
  value: number;
  size?: number;
  className?: string;
};

export function Stars({ value, size = 16, className = "" }: StarsProps) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={`relative inline-block align-middle leading-none ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <span className="text-neutral-300 select-none dark:text-neutral-700">
        ★★★★★
      </span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-star select-none"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
