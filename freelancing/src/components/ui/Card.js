import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = false, padding = 'md' }) => {
  return (
    <div className={`ui-card p-${padding} ${hover ? 'hover-effect' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
