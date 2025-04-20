
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ConversionType = 'length' | 'weight' | 'temperature' | 'area';

interface UnitConverterProps {
  defaultValue?: string;
}

const PREDEFINED_VALUES = [
  "1", "5", "10", "25", "50", "100", "500", "1000"
];

const UnitConverter: React.FC<UnitConverterProps> = ({ defaultValue = '' }) => {
  const [conversionType, setConversionType] = useState<ConversionType>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [fromValue, setFromValue] = useState<string>(defaultValue || '');
  const [toValue, setToValue] = useState<string>('');

  const conversionUnits = {
    length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    weight: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
    temperature: ['°C', '°F', 'K'],
    area: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'ac']
  };

  const conversionFactors: Record<string, Record<string, number>> = {
    // Length conversion factors (to m)
    'mm': { 'mm': 1, 'cm': 0.1, 'm': 0.001, 'km': 0.000001, 'in': 0.0393701, 'ft': 0.00328084, 'yd': 0.00109361, 'mi': 0.000000621371 },
    'cm': { 'mm': 10, 'cm': 1, 'm': 0.01, 'km': 0.00001, 'in': 0.393701, 'ft': 0.0328084, 'yd': 0.0109361, 'mi': 0.00000621371 },
    'm': { 'mm': 1000, 'cm': 100, 'm': 1, 'km': 0.001, 'in': 39.3701, 'ft': 3.28084, 'yd': 1.09361, 'mi': 0.000621371 },
    'km': { 'mm': 1000000, 'cm': 100000, 'm': 1000, 'km': 1, 'in': 39370.1, 'ft': 3280.84, 'yd': 1093.61, 'mi': 0.621371 },
    'in': { 'mm': 25.4, 'cm': 2.54, 'm': 0.0254, 'km': 0.0000254, 'in': 1, 'ft': 0.0833333, 'yd': 0.0277778, 'mi': 0.0000157828 },
    'ft': { 'mm': 304.8, 'cm': 30.48, 'm': 0.3048, 'km': 0.0003048, 'in': 12, 'ft': 1, 'yd': 0.333333, 'mi': 0.000189394 },
    'yd': { 'mm': 914.4, 'cm': 91.44, 'm': 0.9144, 'km': 0.0009144, 'in': 36, 'ft': 3, 'yd': 1, 'mi': 0.000568182 },
    'mi': { 'mm': 1609344, 'cm': 160934, 'm': 1609.34, 'km': 1.60934, 'in': 63360, 'ft': 5280, 'yd': 1760, 'mi': 1 },
    
    // Weight conversion factors (to g)
    'mg': { 'mg': 1, 'g': 0.001, 'kg': 0.000001, 'oz': 0.000035274, 'lb': 0.00000220462, 'ton': 0.000000001 },
    'g': { 'mg': 1000, 'g': 1, 'kg': 0.001, 'oz': 0.035274, 'lb': 0.00220462, 'ton': 0.000001 },
    'kg': { 'mg': 1000000, 'g': 1000, 'kg': 1, 'oz': 35.274, 'lb': 2.20462, 'ton': 0.001 },
    'oz': { 'mg': 28349.5, 'g': 28.3495, 'kg': 0.0283495, 'oz': 1, 'lb': 0.0625, 'ton': 0.00003125 },
    'lb': { 'mg': 453592, 'g': 453.592, 'kg': 0.453592, 'oz': 16, 'lb': 1, 'ton': 0.0005 },
    'ton': { 'mg': 907185000, 'g': 907185, 'kg': 907.185, 'oz': 32000, 'lb': 2000, 'ton': 1 },
    
    
    // Area conversion factors (to m²)
    'mm²': { 'mm²': 1, 'cm²': 0.01, 'm²': 0.000001, 'km²': 0.000000000001, 'in²': 0.00155, 'ft²': 0.0000107639, 'ac': 0.000000000247105 },
    'cm²': { 'mm²': 100, 'cm²': 1, 'm²': 0.0001, 'km²': 0.0000000001, 'in²': 0.155, 'ft²': 0.00107639, 'ac': 0.0000000247105 },
    'm²': { 'mm²': 1000000, 'cm²': 10000, 'm²': 1, 'km²': 0.000001, 'in²': 1550, 'ft²': 10.7639, 'ac': 0.000247105 },
    'km²': { 'mm²': 1000000000000, 'cm²': 10000000000, 'm²': 1000000, 'km²': 1, 'in²': 1550000000, 'ft²': 10763910.4, 'ac': 247.105 },
    'in²': { 'mm²': 645.16, 'cm²': 6.4516, 'm²': 0.00064516, 'km²': 0.00000000064516, 'in²': 1, 'ft²': 0.00694444, 'ac': 0.00000015942 },
    'ft²': { 'mm²': 92903, 'cm²': 929.03, 'm²': 0.09290304, 'km²': 0.00000009290304, 'in²': 144, 'ft²': 1, 'ac': 0.0000229568 },
    'ac': { 'mm²': 4046856422, 'cm²': 40468564.2, 'm²': 4046.86, 'km²': 0.00404686, 'in²': 6272640, 'ft²': 43560, 'ac': 1 }
  };

  const convertValue = (value: string, from: string, to: string, type: ConversionType) => {
    if (value === '') return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (type === 'temperature') {
      if (from === '°C' && to === '°F') {
        return ((numValue * 9/5) + 32).toFixed(2);
      } else if (from === '°F' && to === '°C') {
        return ((numValue - 32) * 5/9).toFixed(2);
      } else if (from === '°C' && to === 'K') {
        return (numValue + 273.15).toFixed(2);
      } else if (from === 'K' && to === '°C') {
        return (numValue - 273.15).toFixed(2);
      } else if (from === '°F' && to === 'K') {
        return ((numValue - 32) * 5/9 + 273.15).toFixed(2);
      } else if (from === 'K' && to === '°F') {
        return ((numValue - 273.15) * 9/5 + 32).toFixed(2);
      } else {
        return numValue.toString(); 
      }
    }
    
    if (conversionFactors[from] && conversionFactors[from][to]) {
      const result = numValue * conversionFactors[from][to];
      return result.toFixed(result < 0.01 ? 6 : 2);
    }
    
    return '';
  };

  useEffect(() => {
    switch (conversionType) {
      case 'length':
        setFromUnit('m');
        setToUnit('km');
        break;
      case 'weight':
        setFromUnit('kg');
        setToUnit('lb');
        break;
      case 'temperature':
        setFromUnit('°C');
        setToUnit('°F');
        break;
      case 'area':
        setFromUnit('m²');
        setToUnit('ft²');
        break;
    }
  }, [conversionType]);

  useEffect(() => {
    if (fromValue) {
      setToValue(convertValue(fromValue, fromUnit, toUnit, conversionType));
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit, conversionType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setFromValue(e.target.value);
  };

  const handleValueSelect = (value: string) => {
    setFromValue(value);
  };

  return (
    <div className="p-4 h-full rounded-xl bg-dark-card/50 border border-white/10">
      <div className="flex items-center justify-between mb-4 border-b border-dark-border/30 pb-4">
        <h3 className="font-medium text-white/80 hover:text-white transition-colors">Unit Converter</h3>
      </div>
      
      <div className="space-y-4">
        <Select onValueChange={(value) => setConversionType(value as ConversionType)} value={conversionType}>
          <SelectTrigger className={cn(
            "w-full bg-dark-card border-dark-border/50",
            "hover:bg-dark-card/80 hover:border-white/20",
            "focus:ring-0 focus:ring-offset-0",
            "transition-all duration-200",
            "text-white/90"
          )}>
            <SelectValue placeholder="Select conversion type" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border/50">
            {['length', 'weight', 'temperature', 'area'].map((type) => (
              <SelectItem 
                key={type} 
                value={type}
                className={cn(
                  "text-white/80 hover:text-white",
                  "focus:bg-white/10 focus:text-white",
                  "cursor-pointer"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Value</label>
            <Select onValueChange={handleValueSelect} value={fromValue || undefined}>
              <SelectTrigger className={cn(
                "w-full bg-dark-card border-dark-border/50",
                "hover:bg-dark-card/80 hover:border-white/20",
                "focus:ring-0 focus:ring-offset-0",
                "transition-all duration-200",
                "text-white/90"
              )}>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50">
                {PREDEFINED_VALUES.map((value) => (
                  <SelectItem 
                    key={value} 
                    value={value}
                    className={cn(
                      "text-white/80 hover:text-white",
                      "focus:bg-white/10 focus:text-white",
                      "cursor-pointer"
                    )}
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/70 text-sm">From</label>
            <Select onValueChange={setFromUnit} value={fromUnit}>
              <SelectTrigger className={cn(
                "w-full bg-dark-card border-dark-border/50",
                "hover:bg-dark-card/80 hover:border-white/20",
                "focus:ring-0 focus:ring-offset-0",
                "transition-all duration-200",
                "text-white/90"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50">
                {conversionUnits[conversionType].map(unit => (
                  <SelectItem 
                    key={unit} 
                    value={unit}
                    className={cn(
                      "text-white/80 hover:text-white",
                      "focus:bg-white/10 focus:text-white",
                      "cursor-pointer"
                    )}
                  >
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Result</label>
            <Input
              type="text"
              value={toValue}
              readOnly
              placeholder="Result"
              className={cn(
                "bg-dark-card/30 border-dark-border/50",
                "text-white/90 cursor-not-allowed",
                "opacity-90"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-white/70 text-sm">To</label>
            <Select onValueChange={setToUnit} value={toUnit}>
              <SelectTrigger className={cn(
                "w-full bg-dark-card border-dark-border/50",
                "hover:bg-dark-card/80 hover:border-white/20",
                "focus:ring-0 focus:ring-offset-0",
                "transition-all duration-200",
                "text-white/90"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50">
                {conversionUnits[conversionType].map(unit => (
                  <SelectItem 
                    key={unit} 
                    value={unit}
                    className={cn(
                      "text-white/80 hover:text-white",
                      "focus:bg-white/10 focus:text-white",
                      "cursor-pointer"
                    )}
                  >
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
