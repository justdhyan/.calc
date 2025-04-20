
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  name: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onUseResult: (result: string) => void;
  theme: string;
  themeConfigs: Record<string, ThemeConfig>;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onClearHistory,
  onUseResult,
  theme,
  themeConfigs
}) => {
  const currentTheme = themeConfigs[theme];
  const primaryGradient = currentTheme?.primary;

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground px-4 py-8">
        <p className="text-center text-[#FFFFF0]">No calculation history yet</p>
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
        )}>History</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearHistory}
          className="h-8 w-8 text-muted-foreground text-[#FFF5EE] hover:text-[#FF6347] transition-colors duration-300"
        >
          <Trash size={16} className="transition-transform duration-300 hover:scale-110" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {history.map((item, index) => (
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
              onClick={() => onUseResult(item.result)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 
                             group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-sm text-white/70 group-hover:text-white/80 transition-colors duration-300">
                {item.expression}
              </div>
              <div className={cn(
                "text-lg font-medium",
                "bg-gradient-to-r",
                primaryGradient,
                "bg-clip-text text-transparent",
                "transition-colors duration-300"
              )}>{item.result}</div>
              <div className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors duration-300">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
