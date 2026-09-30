import "./BrandMark.scss";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`brand${compact ? " brand--compact" : ""}`} aria-label="MAX Bridge">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 36 36" role="img">
          <path d="M10.2 9.7c2.7-2.6 6-3.9 9.7-3.5 5.3.5 9.6 4.9 9.9 10.2.3 6.8-5.1 12.4-11.8 12.4-1.9 0-3.7-.5-5.3-1.3L7 29l1.6-5.2a11.2 11.2 0 0 1 1.6-14.1Z" />
          <path className="brand__spark" d="m13 19.2 3.4-5 2.3 3 4.3-4.7-3.6 8.1-2.5-3.2-3.9 1.8Z" />
        </svg>
      </span>
      {!compact && (
        <span className="brand__name">
          MAX <strong>Bridge</strong>
        </span>
      )}
    </div>
  );
}
