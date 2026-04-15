export default function Mascot() {
  return (
    <div>
      <svg 
        width="180" 
        height="180" 
        viewBox="0 0 100 120" 
        fill="none" 
        stroke="#00ffff" 
        strokeWidth="2" 
        strokeLinecap="square" 
        strokeLinejoin="miter"
      >
        {/* Spikes / Leaves */}
        <polygon points="45,35 50,5 55,35" fill="rgba(255, 0, 255, 0.2)" />
        <polygon points="40,38 15,15 35,30" fill="rgba(255, 0, 255, 0.2)" />
        <polygon points="60,38 85,15 65,30" fill="rgba(255, 0, 255, 0.2)" />

        {/* Arms */}
        <polygon points="28,55 5,55 25,65" fill="rgba(255, 0, 255, 0.2)" />
        <polygon points="72,55 95,55 75,65" fill="rgba(255, 0, 255, 0.2)" />

        {/* Legs */}
        <polygon points="35,75 20,105 45,85" fill="rgba(255, 0, 255, 0.2)" />
        <polygon points="65,75 80,105 55,85" fill="rgba(255, 0, 255, 0.2)" />

        {/* Body */}
        <rect x="26" y="34" width="48" height="48" fill="#000" stroke="#ff00ff" strokeWidth="2" />

        {/* Face */}
        <rect x="38" y="46" width="4" height="4" fill="#00ffff" />
        <rect x="58" y="46" width="4" height="4" fill="#00ffff" />
        <path d="M 40 65 L 50 70 L 60 65" stroke="#00ffff" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}
