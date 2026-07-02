import React from 'react';

export const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '28px', left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#2B1810',
      color: '#F5EFE4',
      padding: '10px 20px',
      borderRadius: '999px',
      fontSize: '13px',
      letterSpacing: '0.03em',
      zIndex: 9999,
      pointerEvents: 'none',
      boxShadow: '0 4px 16px rgba(43,24,16,.3)',
      animation: 'fadeUp .35s cubic-bezier(.16,1,.3,1) both',
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  );
};
