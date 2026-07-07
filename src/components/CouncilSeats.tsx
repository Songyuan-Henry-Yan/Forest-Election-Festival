import type { Candidate, ElectionResult } from '../types/game';
import AnimalAvatar from './AnimalAvatar';

interface Props {
  result: ElectionResult;
  candidates: Candidate[];
}

export default function CouncilSeats({ result, candidates }: Props) {
  if (!result.seats) return null;
  const seats: Candidate[] = [];
  for (const c of candidates) {
    for (let i = 0; i < (result.seats[c.id] ?? 0); i++) seats.push(c);
  }
  return (
    <div className="council">
      <p className="muted">
        🌲 The Council Tree has 7 branches. Each branch seats one council
        member, shared out in proportion to first-choice votes.
      </p>
      <div className="council-seats">
        {seats.map((c, i) => (
          <div key={i} className="council-seat" style={{ borderColor: c.color }}>
            <AnimalAvatar species={c.species} label={`${c.name}, council member`} size={44} />
            <small>{c.name.split(' ')[0]}</small>
          </div>
        ))}
      </div>
      <p className="council-note">
        With a council, groups that would lose a one-winner election still get
        a voice — but the council members must work together to decide things.
      </p>
    </div>
  );
}
