import React from 'react';
import ReactDom from 'react-dom';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgb(34, 34, 34)',
    transform: 'translate(-50%, -50%)',
    zIndex: 1050, // Increased z-index to ensure it overlays above the navbar
    height: '90%',
    width: '90%',
    borderRadius: '8px', // Added border radius for a smoother look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Added shadow for depth
    padding: '20px', // Added padding for better spacing
    overflowY: 'auto' // Added overflow for content that exceeds modal height
};

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1040 // Set z-index slightly lower than modal
};

export default function Modal({ children, onClose }) {
    return ReactDom.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
                <button 
                    className='btn bg-danger fs-4' 
                    style={{ position: 'absolute', top: '10px', right: '10px' }} // Positioned at the top-right corner
                    onClick={onClose}>
                    X
                </button>
                {children}
            </div>
        </>,
        document.getElementById('cart-root')
    );
}
