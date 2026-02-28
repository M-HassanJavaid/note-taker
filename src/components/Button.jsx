import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom
import { Loader2 } from 'lucide-react';
import  cn  from '../utils/cn';

const Button = ({ 
  children, 
  path, 
  onClick, 
  disabled = false, 
  loading = false, 
  className = "", 
  ...props 
}) => {
  // Base styles using your theme variables
  const baseStyles = `
    inline-flex items-center justify-center gap-2 px-6 py-2.5 
    rounded-lg font-medium transition-all duration-200 
    bg-[var(--btn-primary)] text-[var(--text-primary)]
    hover:opacity-90 active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:active:scale-100 text-lg
  `;

  const isDisabled = disabled || loading;

  // The inner content (Loader + Children)
  const content = (
    <>
      {loading && <Loader2 size={18} className="animate-spin text-[var(--accent)]" />}
      {/* <span className={loading ? "opacity-70" : "opacity-100"}> */}
        {children}
      {/* </span> */}
    </>
  );

  // If path is provided, wrap in Link
  if (path && !isDisabled) {
    return (
      <Link to={path} className={cn(baseStyles , className)} {...props}>
        {content}
      </Link>
    );
  }

  // Standard button for onClick or disabled path
  return (
    <button 
      onClick={onClick}
      disabled={isDisabled}
      className={cn(baseStyles , className , loading ? "opacity-70" : "opacity-100 ")}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;