import React from 'react';
import { Dumbbell } from 'lucide-react';

const Loading = ({ fullScreen = false, text = 'Loading Prime Fitness...' }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
      <div className="bg-lime p-3 rounded-circle mb-3 animate-spin shadow-lg" style={{ width: '60px', height: '60px' }}>
        <Dumbbell size={32} className="text-dark" />
      </div>
      <h5 className="font-heading text-white fw-bold">{text}</h5>
      <p className="small text-muted mb-0">Please wait a moment...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-vh-100 bg-dark-custom d-flex align-items-center justify-content-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
