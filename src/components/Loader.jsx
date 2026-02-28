import React from 'react';
import { Loader2 } from 'lucide-react';
import  cn  from '../utils/cn';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
      "bg-(--bg-primary)/80 backdrop-blur-sm"
    )}>
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-(--accent) blur-2xl opacity-20 animate-pulse" />
        
        {/* Spinner */}
        <Loader2 
          size={48} 
          className="text-(--accent) animate-spin relative z-10" 
          strokeWidth={2.5}
        />
      </div>

      {message && (
        <p className="mt-6 text-(--text-secondary) font-medium tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;