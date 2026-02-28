import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import cn  from '../utils/cn';

const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "", 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine if we need to show the toggle button
  const isPassword = type === "password";
  
  // Logic to toggle between 'password' and 'text' types
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(`w-full px-4 py-2.5 rounded-lg 
          bg-[var(--bg-secondary)] 
          text-[var(--text-primary)] 
          placeholder:text-[var(--text-secondary)]
          border border-transparent 
          focus:border-[var(--accent)] 
          outline-none transition-all duration-200` 
          , isPassword ? "pr-11" : "" , className)}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          {showPassword ? (
            <EyeOff size={20} strokeWidth={2} />
          ) : (
            <Eye size={20} strokeWidth={2} />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;