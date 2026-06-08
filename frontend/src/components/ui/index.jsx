import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const sizeStyle = {
    sm: { padding: '0.4rem 0.85rem', fontSize: '0.8rem' },
    md: { padding: '0.625rem 1.25rem', fontSize: '0.9rem' },
    lg: { padding: '0.85rem 2rem', fontSize: '1rem' },
  }[size] || {};

  const variantClass = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    danger: 'btn btn-danger',
  }[variant] || 'btn btn-primary';

  return (
    <button
      className={`${variantClass} ${className}`}
      style={sizeStyle}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = {
    default: 'badge badge-blue',
    success: 'badge badge-green',
    warning: 'badge badge-yellow',
    danger: 'badge badge-red',
    purple: 'badge badge-purple',
  }[variant] || 'badge badge-blue';

  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}
      <input
        className={`form-input ${className}`}
        style={error ? { borderColor: 'var(--negative)' } : {}}
        {...props}
      />
      {error && <p style={{ color: 'var(--negative)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}
