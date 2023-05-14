// src/components/util/SvgButton.tsx

// src/components/util/SvgButton.tsx
import React from 'react';

type SvgButtonProps = {
  onClick?: () => void;
};

const SvgButton: React.FC<SvgButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-circle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12" />
    </svg>
  </button>
);

export default SvgButton;
