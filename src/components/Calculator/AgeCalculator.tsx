
import React, { useState, useEffect } from 'react';
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Month = typeof MONTHS[number];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  name: string;
}

interface AgeCalculatorProps {
  theme: string;
  themeConfigs: Record<string, ThemeConfig>;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

const AgeCalculator: React.FC<AgeCalculatorProps> = ({ theme, themeConfigs }) => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<Month | "">("");
  const [year, setYear] = useState<string>("");
  const [age, setAge] = useState<AgeResult | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = (selectedMonth: Month | "", selectedYear: string) => {
    if (!selectedMonth || !selectedYear) return Array.from({ length: 31 }, (_, i) => i + 1);
    const monthIndex = MONTHS.indexOf(selectedMonth);
    const daysInMonth = getDaysInMonth(monthIndex, parseInt(selectedYear));
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  };

  const calculateAge = () => {
    if (!day || !month || !year) return;
    
    const monthIndex = MONTHS.indexOf(month as Month);
    const birthDate = new Date(parseInt(year), monthIndex, parseInt(day));
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDate.getDate());
      days = Math.floor((today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
    }

    setAge({ years, months, days });
  };

  useEffect(() => {
    calculateAge();
  }, [day, month, year]);

  const currentTheme = themeConfigs[theme];
  const accentColorClass = currentTheme?.primary?.split(' ')[0].replace('from-', '');
  const primaryGradient = themeConfigs[theme]?.primary;

  const selectStyles = cn(
    "bg-dark-card/30 border-dark-border",
    "text-white hover:bg-dark-card/40",
    "focus:ring-0 focus:ring-offset-0",
    "transition-colors duration-200"
  );

  return (
    <div className={cn(
      "p-6 rounded-xl bg-dark-card/50 border border-white/10",
      "transition-all duration-300",
      "hover:bg-dark-card/60 hover:border-white/20"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-white/90">Age Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-white/70 hover:text-white transition-colors">Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className={selectStyles}>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border max-h-[200px]">
                {generateDays(month, year).map((d) => (
                  <SelectItem 
                    key={d} 
                    value={d.toString()}
                    className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/70 hover:text-white transition-colors">Month</Label>
            <Select value={month} onValueChange={(value) => setMonth(value as Month)}>
              <SelectTrigger className={selectStyles}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border">
                {MONTHS.map((m) => (
                  <SelectItem 
                    key={m} 
                    value={m}
                    className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/70 hover:text-white transition-colors">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className={selectStyles}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border max-h-[200px]">
                {generateYears().map((y) => (
                  <SelectItem 
                    key={y} 
                    value={y.toString()}
                    className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {age && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { value: age.years, label: 'Years' },
              { value: age.months, label: 'Months' },
              { value: age.days, label: 'Days' }
            ].map((item, index) => (
              <div key={index} className={cn(
                "p-4 rounded-lg",
                "bg-gradient-to-br from-dark-card/30 to-dark-card/20",
                "border border-white/5",
                "transition-all duration-300",
                "hover:bg-dark-card/30 hover:border-white/10",
                "transform hover:-translate-y-1",
                "animate-in fade-in-50"
              )}>
                <div className={cn(
                  "text-2xl font-bold",
                  `bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`,
                  "transition-colors duration-300"
                )}>{item.value}</div>
                <div className="text-sm text-white/70 hover:text-white/90 transition-colors duration-300">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
