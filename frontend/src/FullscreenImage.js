import React from 'react';
import welcomeImage from './img1.png';

const FullscreenImage = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4">
      <img 
        src={welcomeImage}
        alt="Welcome"
        className="max-w-screen max-h-screen object-contain-image"
      />
      <button
        onClick={onClose}
        className="fixed left-4 bottom-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
      >
        Close
      </button>
    </div>
  );
};

export default FullscreenImage;