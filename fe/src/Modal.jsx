import React from 'react';

export default function Modal({ open, onClose, title = 'Tips', message }) {
  if (!open) return null;
  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div
        className="custom-modal"
        onClick={e => e.stopPropagation()} // Prevent bubbling to close the modal
      >
        <div className="custom-modal-title">{title}</div>
        <div className="custom-modal-message">{message}</div>
        <button className="action-btn" onClick={onClose} style={{ width: '100%' }}>
          OK
        </button>
      </div>
    </div>
  );
}
