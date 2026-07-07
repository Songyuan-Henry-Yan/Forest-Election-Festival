interface Props {
  cost: number;
  budget: number;
}

export default function AcornBudgetTray({ cost, budget }: Props) {
  const over = cost > budget;
  return (
    <div className="acorn-tray" role="group" aria-label={`Acorn budget: ${cost} of ${budget} acorns promised`}>
      <strong className="acorn-tray-title">🌰 Acorn Budget Tray</strong>
      <div className="acorn-slots" aria-hidden="true">
        {Array.from({ length: budget }).map((_, i) => (
          <span key={i} className={`acorn-slot ${i < cost ? 'is-filled' : ''}`}>
            {i < cost ? '🌰' : '·'}
          </span>
        ))}
        {over && (
          <span className="acorn-overflow">
            {'🌰'.repeat(Math.min(6, cost - budget))} spilling over!
          </span>
        )}
      </div>
      <small>
        These promises would use <strong>{cost}</strong> of the forest’s{' '}
        <strong>{budget}</strong> acorns.
      </small>
      {over && (
        <p className="budget-warning" role="note">
          🦉 This plan sounds exciting, but the acorn budget may not be enough.
        </p>
      )}
    </div>
  );
}
