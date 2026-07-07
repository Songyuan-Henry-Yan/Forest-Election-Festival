export function FestivalHeader({ teacher, setTeacher }: { teacher: boolean; setTeacher: (v: boolean) => void }) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">Forest Festival Gate</p>
        <h1>Animal Kingdom Election Festival</h1>
        <p>Same voters. Same ballots. Different voting rules. Will the same animal win?</p>
      </div>
      <label className="switch"><input aria-label="Turn Teacher Mode on or off" type="checkbox" checked={teacher} onChange={(e) => setTeacher(e.target.checked)} /> Teacher Mode</label>
    </header>
  );
}
