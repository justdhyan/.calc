
import React from 'react';
import { cn } from "@/lib/utils";

type KeyType = 'number' | 'operation' | 'function' | 'equals' | 'memory';

interface CalculatorKeyProps {
  value: string;
  type?: KeyType;
  onClick: (value: string) => void;
  className?: string;
  colSpan?: number;
}

const CalculatorKey: React.FC<CalculatorKeyProps> = ({ 
  value, 
  type = 'number', 
  onClick, 
  className,
  colSpan = 1 
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <button 
      onClick={handleClick} 
      className={cn(
        "calculator-key relative overflow-hidden group",
        "before:absolute before:inset-0 before:opacity-0",
        "before:transition-opacity before:duration-200",
        "before:bg-gradient-to-r before:from-white/5 before:to-transparent",
        "transform transition-all duration-200",
        "hover:-translate-y-[1px] active:translate-y-0",
        "hover:shadow-sm",
        type === 'operation' && "hover:text-white",
        type === 'equals' && "hover:text-white",
        `key-${type}`,
        colSpan === 2 && "col-span-2",
        className
      )}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-white rounded-xl blur-sm transition-opacity duration-200"></span>
      
      <span className="relative z-10 transition-transform duration-200 group-hover:scale-[1.02]">{value}</span>
    </button>
  );
};

export default CalculatorKey;
