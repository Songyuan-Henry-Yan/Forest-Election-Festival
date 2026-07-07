const locations = [
  { label: 'Forest Gate', icon: '🌲' },
  { label: 'Election Workshop', icon: '🛠️' },
  { label: 'Issue Trail', icon: '🍃' },
  { label: 'Rally Stage', icon: '🎤' },
  { label: 'Parrot News Stand', icon: '🦜' },
  { label: 'Counting Machine Arcade', icon: '🎰' },
  { label: 'Counting Theater', icon: '🎭' },
  { label: 'Campfire Circle', icon: '🔥' }
];

export function StepPath({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  return (
    <nav className="forest-path" aria-label="Interactive Forest Path">
      {locations.map((location, index) => (
        <button
          className={`path-stop ${index === step ? 'active' : ''} ${index < step ? 'visited' : ''}`}
          onClick={() => setStep(index)}
          key={location.label}
          aria-current={index === step ? 'step' : undefined}
        >
          <span className="path-icon" aria-hidden="true">{location.icon}</span>
          <span className="path-number">Stop {index + 1}</span>
          <span className="path-label">{location.label}</span>
        </button>
      ))}
    </nav>
  );
}
