import type { Candidate } from '../types/game';

export function AnimalAvatar({ candidate }: { candidate: Candidate }) {
  return <span className="avatar" role="img" aria-label={`${candidate.name}, ${candidate.species} avatar`} dangerouslySetInnerHTML={{ __html: candidate.avatar }} />;
}
