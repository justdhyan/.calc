
import React from 'react';
import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  value: string;
  expression: string;
  className?: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ 
  value, 
  expression,
  className 
}) => {
  return (
    <div className={cn(
      "bg-dark-card/50 backdrop-blur-lg rounded-2xl p-4 mb-4",
      "border border-white/5 transition-all duration-300",
      "hover:border-white/10 hover:bg-dark-card/60",
      className
    )}>
      <div className="text-white/40 text-right text-sm h-6 overflow-hidden transition-colors duration-200">
        {expression || "\u00A0"}
      </div>
      <div className="text-white text-right text-4xl font-semibold tracking-tighter mt-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        {value || "0"}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
