
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  name: string;
}

interface MemoryPanelProps {
  memory: string[];
  onClearMemory: () => void;
  onUseMemory: (value: string) => void;
  theme: string;
  themeConfigs: Record<string, ThemeConfig>;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ 
  memory, 
  onClearMemory,
  onUseMemory,
  theme,
  themeConfigs
}) => {
  const currentTheme = themeConfigs[theme];
  const primaryGradient = currentTheme?.primary;

  if (memory.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground px-4 py-8">
        <p className="text-center text-[#FFFFF0]">Memory is empty</p>
        <p className="text-center text-sm mt-2 text-[#F5F5F5]">Use M+ to add values</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        "border-dark-border"
      )}>
        <h3 className={cn(
          "font-medium bg-gradient-to-r",
          primaryGradient,
          "bg-clip-text text-transparent"
        )}>Memory</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearMemory}
          className="h-8 w-8 text-muted-foreground text-[#FFF5EE] hover:text-[#FF6347] transition-colors duration-300"
        >
          <Trash size={16} className="transition-transform duration-300 hover:scale-110" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {memory.map((value, index) => (
            <div 
              key={index} 
              className={cn(
                "p-3 mb-2 rounded-lg",
                "bg-gradient-to-br from-dark-card/30 to-dark-card/20",
                "border border-white/5",
                "transition-all duration-300",
                "hover:bg-dark-card/40 hover:border-white/10",
                "transform hover:-translate-y-1 hover:shadow-md",
                "relative overflow-hidden group"
              )}
              onClick={() => onUseMemory(value)}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0",
                "from-white/5 to-transparent",
                "group-hover:opacity-100 transition-opacity duration-300"
              )}></div>
              <div className={cn(
                "text-lg font-medium",
                "bg-gradient-to-r",
                primaryGradient,
                "bg-clip-text text-transparent",
                "transition-colors duration-300"
              )}>{value}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemoryPanel;
