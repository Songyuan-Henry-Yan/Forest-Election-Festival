// Hand-drawn inline SVG avatars — no external images, no copyrighted art.

interface Props {
  species: string;
  label: string; // accessible description
  size?: number;
}

const EYES = (
  <>
    <circle cx="38" cy="46" r="4.5" fill="#2F2A24" />
    <circle cx="62" cy="46" r="4.5" fill="#2F2A24" />
    <circle cx="39.5" cy="44.5" r="1.5" fill="#FFFDF7" />
    <circle cx="63.5" cy="44.5" r="1.5" fill="#FFFDF7" />
  </>
);

const SMILE = (
  <path d="M42 60 Q50 68 58 60" stroke="#2F2A24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
);

function Fox() {
  return (
    <>
      <polygon points="18,18 38,30 24,44" fill="#E8853D" />
      <polygon points="82,18 62,30 76,44" fill="#E8853D" />
      <polygon points="22,22 34,30 26,39" fill="#FFF8E7" />
      <polygon points="78,22 66,30 74,39" fill="#FFF8E7" />
      <circle cx="50" cy="52" r="30" fill="#E8853D" />
      <path d="M30 62 Q50 84 70 62 L60 70 Q50 76 40 70 Z" fill="#FFF8E7" />
      <ellipse cx="50" cy="60" rx="7" ry="5" fill="#FFF8E7" />
      <circle cx="50" cy="58" r="3.5" fill="#2F2A24" />
      {EYES}
      <path d="M20 78 Q34 70 46 80 Q34 90 20 84 Z" fill="#6FAE75" />
    </>
  );
}

function Lion() {
  return (
    <>
      <circle cx="50" cy="52" r="38" fill="#B97A2A" />
      <circle cx="50" cy="52" r="29" fill="#D9A441" />
      <circle cx="30" cy="26" r="7" fill="#D9A441" />
      <circle cx="70" cy="26" r="7" fill="#D9A441" />
      <ellipse cx="50" cy="62" rx="9" ry="7" fill="#F3E2B8" />
      <path d="M46 58 L54 58 L50 63 Z" fill="#2F2A24" />
      {EYES}
      <path d="M44 66 Q50 71 56 66" stroke="#2F2A24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M24 84 Q50 96 76 84 L76 92 Q50 100 24 92 Z" fill="#91C8E4" />
    </>
  );
}

function Beaver() {
  return (
    <>
      <rect x="30" y="8" width="40" height="14" rx="7" fill="#F7D774" />
      <rect x="26" y="18" width="48" height="7" rx="3.5" fill="#E0B94F" />
      <circle cx="28" cy="34" r="8" fill="#8B5E3C" />
      <circle cx="72" cy="34" r="8" fill="#8B5E3C" />
      <circle cx="50" cy="54" r="29" fill="#8B5E3C" />
      <ellipse cx="50" cy="64" rx="13" ry="10" fill="#B98A62" />
      <rect x="45" y="66" width="4.5" height="8" rx="1.5" fill="#FFFDF7" />
      <rect x="50.5" y="66" width="4.5" height="8" rx="1.5" fill="#FFFDF7" />
      <ellipse cx="50" cy="58" rx="5" ry="4" fill="#2F2A24" />
      {EYES}
      <rect x="66" y="70" width="20" height="26" rx="4" fill="#FFF8E7" stroke="#8B5E3C" strokeWidth="2" transform="rotate(12 76 83)" />
      <line x1="70" y1="78" x2="82" y2="81" stroke="#91C8E4" strokeWidth="2" transform="rotate(12 76 83)" />
      <line x1="70" y1="84" x2="82" y2="87" stroke="#91C8E4" strokeWidth="2" transform="rotate(12 76 83)" />
    </>
  );
}

function Dolphin() {
  return (
    <>
      <path d="M14 66 Q20 46 42 38 Q66 30 82 44 Q90 52 84 62 Q72 80 46 80 Q24 80 14 66 Z" fill="#5BB8C9" />
      <path d="M44 38 Q48 22 62 20 Q58 32 54 40 Z" fill="#4AA3B4" />
      <path d="M14 66 Q6 60 4 50 Q14 52 20 58 Z" fill="#4AA3B4" />
      <path d="M20 64 Q40 74 62 68 Q48 78 32 76 Q24 72 20 64 Z" fill="#DFF3F7" />
      <circle cx="66" cy="48" r="4.5" fill="#2F2A24" />
      <circle cx="67.5" cy="46.5" r="1.5" fill="#FFFDF7" />
      <path d="M74 56 Q80 58 84 54" stroke="#2F2A24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="34" r="3" fill="#91C8E4" />
      <circle cx="32" cy="26" r="4" fill="#91C8E4" />
      <circle cx="18" cy="24" r="2.5" fill="#91C8E4" />
    </>
  );
}

function Panda() {
  return (
    <>
      <circle cx="28" cy="28" r="11" fill="#2F2A24" />
      <circle cx="72" cy="28" r="11" fill="#2F2A24" />
      <circle cx="50" cy="52" r="30" fill="#FFFDF7" stroke="#E8E2D4" strokeWidth="1.5" />
      <ellipse cx="38" cy="46" rx="8.5" ry="10" fill="#2F2A24" />
      <ellipse cx="62" cy="46" rx="8.5" ry="10" fill="#2F2A24" />
      <circle cx="38" cy="46" r="3.5" fill="#FFFDF7" />
      <circle cx="62" cy="46" r="3.5" fill="#FFFDF7" />
      <circle cx="38" cy="46" r="1.7" fill="#2F2A24" />
      <circle cx="62" cy="46" r="1.7" fill="#2F2A24" />
      <ellipse cx="50" cy="60" rx="5" ry="4" fill="#2F2A24" />
      {SMILE}
      <rect x="60" y="70" width="8" height="22" rx="3" fill="#6FAE75" transform="rotate(-18 64 81)" />
      <ellipse cx="72" cy="70" rx="6" ry="3.5" fill="#A8D8B9" transform="rotate(-30 72 70)" />
    </>
  );
}

function Owl() {
  return (
    <>
      <path d="M28 26 L36 34 L20 36 Z" fill="#6FAE75" />
      <path d="M72 26 L64 34 L80 36 Z" fill="#6FAE75" />
      <ellipse cx="50" cy="54" rx="30" ry="32" fill="#6FAE75" />
      <path d="M30 70 Q50 84 70 70 L70 78 Q50 92 30 78 Z" fill="#A8D8B9" />
      <circle cx="38" cy="46" r="11" fill="#FFFDF7" stroke="#2F2A24" strokeWidth="2.5" />
      <circle cx="62" cy="46" r="11" fill="#FFFDF7" stroke="#2F2A24" strokeWidth="2.5" />
      <line x1="49" y1="46" x2="51" y2="46" stroke="#2F2A24" strokeWidth="2.5" />
      <circle cx="38" cy="46" r="4" fill="#2F2A24" />
      <circle cx="62" cy="46" r="4" fill="#2F2A24" />
      <polygon points="50,54 46,60 54,60" fill="#F7D774" />
      <rect x="18" y="74" width="18" height="22" rx="2.5" fill="#F4A6A6" />
      <line x1="21" y1="80" x2="33" y2="80" stroke="#FFFDF7" strokeWidth="2" />
      <line x1="21" y1="85" x2="33" y2="85" stroke="#FFFDF7" strokeWidth="2" />
    </>
  );
}

function Turtle() {
  return (
    <>
      <circle cx="50" cy="60" r="30" fill="#4E9B8F" />
      <circle cx="50" cy="60" r="22" fill="#F7D774" />
      <path d="M50 38 L58 50 L50 62 L42 50 Z" fill="#F4A6A6" />
      <path d="M34 54 L44 60 L36 70 Z" fill="#D6C6F2" />
      <path d="M66 54 L56 60 L64 70 Z" fill="#A8D8B9" />
      <circle cx="50" cy="24" r="13" fill="#6FBFAF" />
      <circle cx="45" cy="22" r="3.5" fill="#2F2A24" />
      <circle cx="55" cy="22" r="3.5" fill="#2F2A24" />
      <path d="M46 29 Q50 32 54 29" stroke="#2F2A24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="78" cy="84" rx="14" ry="8" fill="#8B5E3C" />
      <circle cx="72" cy="80" r="3.5" fill="#F4A6A6" />
      <circle cx="80" cy="78" r="3.5" fill="#91C8E4" />
      <circle cx="86" cy="82" r="3.5" fill="#F7D774" />
    </>
  );
}

function Rabbit() {
  return (
    <>
      <ellipse cx="38" cy="18" rx="8" ry="17" fill="#E8AEBB" transform="rotate(-8 38 18)" />
      <ellipse cx="62" cy="18" rx="8" ry="17" fill="#E8AEBB" transform="rotate(8 62 18)" />
      <ellipse cx="38" cy="19" rx="4" ry="12" fill="#F8D9E0" transform="rotate(-8 38 19)" />
      <ellipse cx="62" cy="19" rx="4" ry="12" fill="#F8D9E0" transform="rotate(8 62 19)" />
      <circle cx="50" cy="52" r="27" fill="#E8AEBB" />
      <ellipse cx="50" cy="60" rx="10" ry="8" fill="#F8D9E0" />
      <ellipse cx="50" cy="56" rx="3.5" ry="3" fill="#2F2A24" />
      {EYES}
      <path d="M44 64 Q50 68 56 64" stroke="#2F2A24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M70 66 L88 58 L88 76 Z" fill="#E8853D" />
      <rect x="64" y="64" width="10" height="6" rx="2" fill="#A8D8B9" />
    </>
  );
}

function Elephant() {
  return (
    <>
      <circle cx="22" cy="46" r="15" fill="#B4A9D6" />
      <circle cx="78" cy="46" r="15" fill="#B4A9D6" />
      <circle cx="22" cy="46" r="9" fill="#D6C6F2" />
      <circle cx="78" cy="46" r="9" fill="#D6C6F2" />
      <circle cx="50" cy="50" r="27" fill="#9B8EC4" />
      <path d="M46 64 Q44 82 54 88 Q60 90 62 84 Q56 84 54 78 Q52 72 54 64 Z" fill="#9B8EC4" />
      {EYES}
      <path d="M40 60 Q45 64 50 62" stroke="#2F2A24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="62" y="66" width="22" height="28" rx="3" fill="#FFF8E7" stroke="#8B5E3C" strokeWidth="2" transform="rotate(-8 73 80)" />
      <line x1="66" y1="74" x2="80" y2="72" stroke="#8B5E3C" strokeWidth="2" transform="rotate(-8 73 80)" />
      <line x1="67" y1="80" x2="81" y2="78" stroke="#8B5E3C" strokeWidth="2" transform="rotate(-8 73 80)" />
    </>
  );
}

function Raccoon() {
  return (
    <>
      <polygon points="24,20 40,30 28,42" fill="#8C8C9A" />
      <polygon points="76,20 60,30 72,42" fill="#8C8C9A" />
      <circle cx="50" cy="52" r="29" fill="#8C8C9A" />
      <path d="M24 44 Q38 36 50 44 Q62 36 76 44 Q70 56 58 54 Q50 50 42 54 Q30 56 24 44 Z" fill="#4A4A56" />
      <circle cx="38" cy="46" r="5" fill="#FFFDF7" />
      <circle cx="62" cy="46" r="5" fill="#FFFDF7" />
      <circle cx="38" cy="46" r="2.7" fill="#2F2A24" />
      <circle cx="62" cy="46" r="2.7" fill="#2F2A24" />
      <path d="M36 62 Q50 76 64 62 L58 70 Q50 74 42 70 Z" fill="#DCDCE4" />
      <ellipse cx="50" cy="60" rx="4.5" ry="3.5" fill="#2F2A24" />
      <circle cx="80" cy="76" r="9" fill="#F7D774" />
      <path d="M76 70 Q80 62 84 70" stroke="#E0B94F" strokeWidth="2.5" fill="none" />
    </>
  );
}

function Generic() {
  return (
    <>
      <circle cx="50" cy="52" r="30" fill="#A8D8B9" />
      {EYES}
      {SMILE}
    </>
  );
}

export default function AnimalAvatar({ species, label, size = 72 }: Props) {
  const art = (() => {
    switch (species.toLowerCase()) {
      case 'fox': return <Fox />;
      case 'lion': return <Lion />;
      case 'beaver': return <Beaver />;
      case 'dolphin': return <Dolphin />;
      case 'panda': return <Panda />;
      case 'owl': return <Owl />;
      case 'turtle': return <Turtle />;
      case 'rabbit': return <Rabbit />;
      case 'elephant': return <Elephant />;
      case 'raccoon': return <Raccoon />;
      default: return <Generic />;
    }
  })();
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className="animal-avatar"
    >
      {art}
    </svg>
  );
}
