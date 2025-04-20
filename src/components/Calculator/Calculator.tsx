import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calculator as CalculatorIcon, 
  Plus, 
  Minus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Minimize,
  Maximize
} from "lucide-react";
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKey from './CalculatorKey';
import HistoryPanel, { HistoryItem } from './HistoryPanel';
import MemoryPanel from './CalculatorMemory';
import UnitConverter from './UnitConverter';
import CurrencyConverter from './CurrencyConverter';
import AgeCalculator from './AgeCalculator';
import { useToast } from "@/hooks/use-toast";

type CalculatorMode = 'basic' | 'scientific';
type SidePanel = 'history' | 'memory' | 'converter' | null;
type ThemeOption = 'pastel-lavender' | 'pastel-mint' | 'pastel-peach';

interface CalculatorState {
  displayValue: string;
  expression: string;
  storedValue: number | null;
  waitingForOperand: boolean;
  pendingOperator: string | null;
  memory: string[];
  history: HistoryItem[];
  mode: CalculatorMode;
  sidePanel: SidePanel;
  theme: ThemeOption;
}

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  name: string;
}

const themeConfigs: Record<ThemeOption, ThemeConfig> = {
  'pastel-lavender': {
    primary: 'from-[#E5DEFF] to-[#D3C6FF]',
    secondary: 'from-[#FDE1D3] to-[#FEC6A1]',
    accent: '[#E5DEFF]',
    gradient: 'from-[#1A1F2C] to-[#13111C]',
    name: 'Pastel Lavender'
  },
  'pastel-mint': {
    primary: 'from-[#F2FCE2] to-[#DBEBC4]',
    secondary: 'from-[#D3E4FD] to-[#B6D3F9]',
    accent: '[#F2FCE2]',
    gradient: 'from-[#1A1F2C] to-[#141812]',
    name: 'Pastel Mint'
  },
  'pastel-peach': {
    primary: 'from-[#FDE1D3] to-[#FEC6A1]',
    secondary: 'from-[#FFDEE2] to-[#FFB5BC]',
    accent: '[#FDE1D3]',
    gradient: 'from-[#1A1F2C] to-[#1C1614]',
    name: 'Pastel Peach'
  }
};

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [memory, setMemory] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);
  const [theme, setTheme] = useState<ThemeOption>('pastel-lavender');
  const { toast } = useToast();

  const clearAll = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setWaitingForOperand(true);
    setPendingOperator(null);
    setExpression('');
  };

  const clearEntry = () => {
    setDisplayValue('0');
    setWaitingForOperand(true);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  };

  const inputPercent = () => {
    const value = parseFloat(displayValue);
    if (!isNaN(value)) {
      const newValue = value / 100;
      setDisplayValue(String(newValue));
    }
  };

  const toggleSign = () => {
    const value = parseFloat(displayValue);
    if (!isNaN(value) && value !== 0) {
      setDisplayValue(String(-value));
    }
  };

  const calculateResult = () => {
    const displayValueAsNumber = parseFloat(displayValue);
    
    if (isNaN(displayValueAsNumber)) return false;

    if (pendingOperator) {
      let newResult: number;
      if (storedValue === null) {
        newResult = displayValueAsNumber;
      } else {
        switch (pendingOperator) {
          case '+': newResult = storedValue + displayValueAsNumber; break;
          case '-': newResult = storedValue - displayValueAsNumber; break;
          case '×': newResult = storedValue * displayValueAsNumber; break;
          case '÷': 
            if (displayValueAsNumber === 0) {
              setDisplayValue('Error');
              setExpression('');
              setStoredValue(null);
              setWaitingForOperand(true);
              setPendingOperator(null);
              return false;
            }
            newResult = storedValue / displayValueAsNumber; 
            break;
          case 'xⁿ': newResult = Math.pow(storedValue, displayValueAsNumber); break;
          default: newResult = displayValueAsNumber;
        }
      }

      const newDisplayValue = String(newResult);
      const fullExpression = expression + displayValue;

      setDisplayValue(newDisplayValue);
      setStoredValue(null);
      setPendingOperator(null);
      setWaitingForOperand(true);
      setExpression('');

      const historyItem: HistoryItem = {
        expression: fullExpression + '=',
        result: newDisplayValue,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev]);

      return true;
    }
    return false;
  };

  const performOperation = (operator: string) => {
    const displayValueAsNumber = parseFloat(displayValue);
    
    if (isNaN(displayValueAsNumber)) return;

    if (storedValue === null) {
      setStoredValue(displayValueAsNumber);
      setExpression(displayValue + ' ' + operator + ' ');
    } else if (pendingOperator) {
      let newResult: number;
      switch (pendingOperator) {
        case '+': newResult = storedValue + displayValueAsNumber; break;
        case '-': newResult = storedValue - displayValueAsNumber; break;
        case '×': newResult = storedValue * displayValueAsNumber; break;
        case '÷': 
          if (displayValueAsNumber === 0) {
            setDisplayValue('Error');
            setExpression('');
            setStoredValue(null);
            setWaitingForOperand(true);
            setPendingOperator(null);
            return;
          }
          newResult = storedValue / displayValueAsNumber; 
          break;
        case 'xⁿ': newResult = Math.pow(storedValue, displayValueAsNumber); break;
        default: newResult = displayValueAsNumber;
      }
      
      setStoredValue(newResult);
      setExpression(expression + displayValue + ' ' + operator + ' ');
    } else {
      setExpression(displayValue + ' ' + operator + ' ');
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
  };

  const performSingleOperation = (operation: 'sqrt' | 'square' | 'reciprocal' | 'sin' | 'cos' | 'tan' | 'log' | 'ln') => {
    const value = parseFloat(displayValue);
    if (isNaN(value)) return;
    
    let result: number;
    let operationSymbol: string;
    
    switch (operation) {
      case 'sqrt':
        result = Math.sqrt(value);
        operationSymbol = '√';
        break;
      case 'square':
        result = value * value;
        operationSymbol = '^2';
        break;
      case 'reciprocal':
        if (value === 0) {
          setDisplayValue('Error');
          return;
        }
        result = 1 / value;
        operationSymbol = '^-1';
        break;
      case 'sin':
        result = Math.sin(value * (Math.PI / 180)); 
        operationSymbol = 'sin';
        break;
      case 'cos':
        result = Math.cos(value * (Math.PI / 180));
        operationSymbol = 'cos';
        break;
      case 'tan':
        result = Math.tan(value * (Math.PI / 180));
        operationSymbol = 'tan';
        break;
      case 'log':
        if (value <= 0) {
          setDisplayValue('Error');
          return;
        }
        result = Math.log10(value);
        operationSymbol = 'log';
        break;
      case 'ln':
        if (value <= 0) {
          setDisplayValue('Error');
          return;
        }
        result = Math.log(value);
        operationSymbol = 'ln';
        break;
      default:
        return;
    }
    
    const resultString = String(result);
    const historyItem: HistoryItem = {
      expression: `${operationSymbol}(${displayValue})=`,
      result: resultString,
      timestamp: new Date()
    };
    
    setDisplayValue(resultString);
    setWaitingForOperand(true);
    setHistory(prev => [historyItem, ...prev]);
  };

  const handleConstant = (constant: 'pi' | 'e') => {
    if (constant === 'pi') {
      setDisplayValue(String(Math.PI));
    } else if (constant === 'e') {
      setDisplayValue(String(Math.E));
    }
    setWaitingForOperand(false);
  };

  const handleMemoryOperation = (operation: 'mc' | 'mr' | 'ms' | 'm+' | 'm-') => {
    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue) && operation !== 'mc' && operation !== 'mr') return;

    switch (operation) {
      case 'mc': // Memory Clear
        setMemory([]);
        break;
      case 'mr': // Memory Recall
        if (memory.length > 0) {
          setDisplayValue(memory[0]);
          setWaitingForOperand(false);
        }
        break;
      case 'ms': // Memory Store
        setMemory([displayValue, ...memory]);
        setWaitingForOperand(true);
        break;
      case 'm+': // Memory Add
        if (memory.length > 0) {
          const memoryValue = parseFloat(memory[0]);
          const newValue = memoryValue + currentValue;
          setMemory([String(newValue), ...memory.slice(1)]);
        } else {
          setMemory([displayValue]);
        }
        setWaitingForOperand(true);
        break;
      case 'm-': // Memory Subtract
        if (memory.length > 0) {
          const memoryValue = parseFloat(memory[0]);
          const newValue = memoryValue - currentValue;
          setMemory([String(newValue), ...memory.slice(1)]);
        } else {
          setMemory([String(-currentValue)]);
        }
        setWaitingForOperand(true);
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    let handled = false;

    if ('0123456789'.includes(event.key)) {
      inputDigit(event.key);
      handled = true;
    } else if (event.key === '.') {
      inputDecimal();
      handled = true;
    } else if (event.key === '=' || event.key === 'Enter') {
      calculateResult();
      handled = true;
    } else if (event.key === 'Backspace') {
      if (!waitingForOperand && displayValue !== '0') {
        setDisplayValue(displayValue.length === 1 ? '0' : displayValue.substring(0, displayValue.length - 1));
        handled = true;
      }
    } else if (event.key === 'Escape') {
      clearAll();
      handled = true;
    } else if (event.key === '+') {
      performOperation('+');
      handled = true;
    } else if (event.key === '-') {
      performOperation('-');
      handled = true;
    } else if (event.key === '*') {
      performOperation('×');
      handled = true;
    } else if (event.key === '/') {
      performOperation('÷');
      handled = true;
    } else if (event.key === '%') {
      inputPercent();
      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const basicModeKeys = [
    [
      { value: 'MC', type: 'memory' as const, onClick: () => handleMemoryOperation('mc') },
      { value: 'MR', type: 'memory' as const, onClick: () => handleMemoryOperation('mr') },
      { value: 'M+', type: 'memory' as const, onClick: () => handleMemoryOperation('m+') },
      { value: 'M-', type: 'memory' as const, onClick: () => handleMemoryOperation('m-') },
    ],
    [
      { value: 'C', type: 'function' as const, onClick: clearAll },
      { value: 'CE', type: 'function' as const, onClick: clearEntry },
      { value: '%', type: 'function' as const, onClick: inputPercent },
      { value: '÷', type: 'operation' as const, onClick: () => performOperation('÷') },
    ],
    [
      { value: '7', type: 'number' as const, onClick: () => inputDigit('7') },
      { value: '8', type: 'number' as const, onClick: () => inputDigit('8') },
      { value: '9', type: 'number' as const, onClick: () => inputDigit('9') },
      { value: '×', type: 'operation' as const, onClick: () => performOperation('×') },
    ],
    [
      { value: '4', type: 'number' as const, onClick: () => inputDigit('4') },
      { value: '5', type: 'number' as const, onClick: () => inputDigit('5') },
      { value: '6', type: 'number' as const, onClick: () => inputDigit('6') },
      { value: '-', type: 'operation' as const, onClick: () => performOperation('-') },
    ],
    [
      { value: '1', type: 'number' as const, onClick: () => inputDigit('1') },
      { value: '2', type: 'number' as const, onClick: () => inputDigit('2') },
      { value: '3', type: 'number' as const, onClick: () => inputDigit('3') },
      { value: '+', type: 'operation' as const, onClick: () => performOperation('+') },
    ],
    [
      { value: '±', type: 'function' as const, onClick: toggleSign },
      { value: '0', type: 'number' as const, onClick: () => inputDigit('0') },
      { value: '.', type: 'number' as const, onClick: inputDecimal },
      { value: '=', type: 'equals' as const, onClick: calculateResult },
    ],
  ];

  const scientificModeKeys = [
    [
      { value: 'MC', type: 'memory' as const, onClick: () => handleMemoryOperation('mc') },
      { value: 'MR', type: 'memory' as const, onClick: () => handleMemoryOperation('mr') },
      { value: 'MS', type: 'memory' as const, onClick: () => handleMemoryOperation('ms') },
      { value: 'M+', type: 'memory' as const, onClick: () => handleMemoryOperation('m+') },
      { value: 'M-', type: 'memory' as const, onClick: () => handleMemoryOperation('m-') },
    ],
    [
      { value: '2ⁿᵈ', type: 'function' as const, onClick: () => {} },
      { value: 'π', type: 'function' as const, onClick: () => handleConstant('pi') },
      { value: 'e', type: 'function' as const, onClick: () => handleConstant('e') },
      { value: 'C', type: 'function' as const, onClick: clearAll },
      { value: '⌫', type: 'function' as const, onClick: () => {
        if (!waitingForOperand && displayValue !== '0') {
          setDisplayValue(displayValue.length === 1 ? '0' : displayValue.substring(0, displayValue.length - 1));
        }
      }},
    ],
    [
      { value: 'x²', type: 'function' as const, onClick: () => performSingleOperation('square') },
      { value: '1/x', type: 'function' as const, onClick: () => performSingleOperation('reciprocal') },
      { value: '|x|', type: 'function' as const, onClick: () => {
        const value = parseFloat(displayValue);
        if (!isNaN(value)) {
          setDisplayValue(String(Math.abs(value)));
        }
      }},
      { value: 'exp', type: 'function' as const, onClick: () => {
        const value = parseFloat(displayValue);
        if (!isNaN(value)) {
          setDisplayValue(String(Math.exp(value)));
        }
      }},
      { value: 'mod', type: 'operation' as const, onClick: () => performOperation('mod') },
    ],
    [
      { value: '√', type: 'function' as const, onClick: () => performSingleOperation('sqrt') },
      { value: '(', type: 'function' as const, onClick: () => {} },
      { value: ')', type: 'function' as const, onClick: () => {} },
      { value: 'n!', type: 'function' as const, onClick: () => {
        const value = parseInt(displayValue);
        if (!isNaN(value) && value >= 0 && value <= 170) {
          let factorial = 1;
          for (let i = 2; i <= value; i++) {
            factorial *= i;
          }
          setDisplayValue(String(factorial));
        } else {
          setDisplayValue('Error');
        }
      }},
      { value: '÷', type: 'operation' as const, onClick: () => performOperation('÷') },
    ],
    [
      { value: 'xⁿ', type: 'operation' as const, onClick: () => performOperation('xⁿ') },
      { value: '7', type: 'number' as const, onClick: () => inputDigit('7') },
      { value: '8', type: 'number' as const, onClick: () => inputDigit('8') },
      { value: '9', type: 'number' as const, onClick: () => inputDigit('9') },
      { value: '×', type: 'operation' as const, onClick: () => performOperation('×') },
    ],
    [
      { value: '10ˣ', type: 'function' as const, onClick: () => {
        const value = parseFloat(displayValue);
        if (!isNaN(value)) {
          setDisplayValue(String(Math.pow(10, value)));
        }
      }},
      { value: '4', type: 'number' as const, onClick: () => inputDigit('4') },
      { value: '5', type: 'number' as const, onClick: () => inputDigit('5') },
      { value: '6', type: 'number' as const, onClick: () => inputDigit('6') },
      { value: '-', type: 'operation' as const, onClick: () => performOperation('-') },
    ],
    [
      { value: 'log', type: 'function' as const, onClick: () => performSingleOperation('log') },
      { value: '1', type: 'number' as const, onClick: () => inputDigit('1') },
      { value: '2', type: 'number' as const, onClick: () => inputDigit('2') },
      { value: '3', type: 'number' as const, onClick: () => inputDigit('3') },
      { value: '+', type: 'operation' as const, onClick: () => performOperation('+') },
    ],
    [
      { value: 'ln', type: 'function' as const, onClick: () => performSingleOperation('ln') },
      { value: '±', type: 'function' as const, onClick: toggleSign },
      { value: '0', type: 'number' as const, onClick: () => inputDigit('0') },
      { value: '.', type: 'number' as const, onClick: inputDecimal },
      { value: '=', type: 'equals' as const, onClick: calculateResult },
    ],
  ];

  const toggleSidePanel = (panel: SidePanel) => {
    if (sidePanel === panel) {
      setSidePanel(null);
    } else {
      setSidePanel(panel);
    }
  };

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
  };

  const getTabButtonClasses = (tabName: SidePanel) => {
    const isActive = sidePanel === tabName;
    const activeThemeColor = themeConfigs[theme].primary.split(' ')[0].replace('from-', '');
    
    return cn(
      "text-xs px-3 border rounded-full",
      "transition-all duration-300",
      "hover:scale-105 active:scale-95",
      "relative overflow-hidden",
      "after:absolute after:inset-0 after:opacity-0",
      "after:bg-gradient-to-r after:from-white/10 after:to-transparent",
      "after:transition-opacity after:duration-300",
      "hover:after:opacity-100",
      isActive 
        ? `border-${activeThemeColor} text-${activeThemeColor} bg-${activeThemeColor}/10` 
        : "border-transparent text-white/70 hover:text-white hover:border-white/20",
      "animate-in fade-in-50",
      isActive && "shadow-sm"
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className={cn(
          "flex-1 p-6 rounded-2xl",
          "glassmorphism",
          "transition-all duration-300",
          `bg-gradient-to-br ${themeConfigs[theme].gradient}`,
          sidePanel && "md:max-w-[65%]"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white/90 hover:text-white transition-colors duration-200">
                <CalculatorIcon className={cn(
                  "mr-2 h-5 w-5",
                  `text-${themeConfigs[theme].primary.split(' ')[0].replace('from-', '')}`,
                  "transition-all duration-300 hover:scale-110"
                )} />
                <h2 className="text-xl font-semibold">.calc</h2>
              </div>

              <div className="flex items-start space-x-2">
                {Object.keys(themeConfigs).map((themeKey) => (
                  <Button
                    key={themeKey}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "w-3 h-3 rounded-full p-0 transition-all duration-200",
                      `bg-gradient-to-r ${themeConfigs[themeKey as ThemeOption].primary}`,
                      theme === themeKey ? "scale-110 ring-2 ring-white/20" : "hover:scale-105",
                    )}
                    onClick={() => handleThemeChange(themeKey as ThemeOption)}
                    title={themeConfigs[themeKey as ThemeOption].name}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                size="sm"
                variant="ghost"
                className={getTabButtonClasses('history')}
                onClick={() => toggleSidePanel('history')}
              >
                <span className="relative z-10">History</span>
                {sidePanel === 'history' && (
                  <span className={cn(
                    "absolute inset-0 opacity-20 bg-gradient-to-r",
                    `from-${themeConfigs[theme].primary.split(' ')[0].replace('from-', '')} to-transparent`,
                    "text-[#FFFFF0]"
                  )} />
                )}
              </Button>
              
              <Button 
                size="sm"
                variant="ghost"
                className={getTabButtonClasses('memory')}
                onClick={() => toggleSidePanel('memory')}
              >
                <span className="relative z-10">Memory</span>
                {sidePanel === 'memory' && (
                  <span className={cn(
                    "absolute inset-0 opacity-20 bg-gradient-to-r",
                    `from-${themeConfigs[theme].primary.split(' ')[0].replace('from-', '')} to-transparent`,
                    "animate-in fade-in-50"
                  )} />
                )}
              </Button>
              
              <Button 
                size="sm"
                variant="ghost"
                className={getTabButtonClasses('converter')}
                onClick={() => toggleSidePanel('converter')}
              >
                <span className="relative z-10">Converter</span>
                {sidePanel === 'converter' && (
                  <span className={cn(
                    "absolute inset-0 opacity-20 bg-gradient-to-r",
                    `from-${themeConfigs[theme].primary.split(' ')[0].replace('from-', '')} to-transparent`,
                    "animate-in fade-in-50"
                  )} />
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" onValueChange={(value) => setMode(value as CalculatorMode)}>
            <TabsList className="mb-6 bg-dark-card/50 border border-dark-border">
              <TabsTrigger 
                value="basic"
                className={cn(
                  "text-white/70 transition-all duration-300",
                  mode === 'basic' ? 'data-[state=active]:bg-dark-card data-[state=active]:text-white scale-105' : 'hover:text-white'
                )}
              >
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="scientific"
                className={cn(
                  "text-white/70 transition-all duration-300",
                  mode === 'scientific' ? 'data-[state=active]:bg-dark-card data-[state=active]:text-white scale-105' : 'hover:text-white'
                )}
              >
                Scientific
              </TabsTrigger>
            </TabsList>
            
            <CalculatorDisplay 
              value={displayValue} 
              expression={expression} 
            />

            <TabsContent 
              value="basic" 
              className={cn(
                "mt-0 transition-all duration-300",
                "data-[state=active]:animate-in data-[state=inactive]:animate-out",
                "data-[state=inactive]:fade-out-50 data-[state=active]:fade-in-50",
                "data-[state=inactive]:zoom-out-95 data-[state=active]:zoom-in-95"
              )}
            >
              <div className="grid grid-cols-4 gap-2">
                {basicModeKeys.map((row, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((key, keyIndex) => (
                      <CalculatorKey
                        key={`key-${rowIndex}-${keyIndex}`}
                        value={key.value}
                        type={key.type}
                        onClick={key.onClick}
                        className={cn(
                          "transition-all duration-300",
                          "hover:scale-105 active:scale-95",
                          key.type === 'operation' && `hover:bg-${themeConfigs[theme].accent}`,
                          key.type === 'equals' && `hover:bg-${themeConfigs[theme].secondary}`
                        )}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent 
              value="scientific" 
              className={cn(
                "mt-0 transition-all duration-300",
                "data-[state=active]:animate-in data-[state=inactive]:animate-out",
                "data-[state=inactive]:fade-out-50 data-[state=active]:fade-in-50",
                "data-[state=inactive]:zoom-out-95 data-[state=active]:zoom-in-95"
              )}
            >
              <div className="grid grid-cols-5 gap-2">
                {scientificModeKeys.map((row, rowIndex) => (
                  <React.Fragment key={`sci-row-${rowIndex}`}>
                    {row.map((key, keyIndex) => (
                      <CalculatorKey
                        key={`sci-key-${rowIndex}-${keyIndex}`}
                        value={key.value}
                        type={key.type}
                        onClick={key.onClick}
                        className={cn(
                          "transition-all duration-300",
                          "hover:scale-105 active:scale-95",
                          key.type === 'operation' && `hover:bg-${themeConfigs[theme].accent}`,
                          key.type === 'equals' && `hover:bg-${themeConfigs[theme].secondary}`
                        )}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {sidePanel && (
          <div className={cn(
            "md:w-[35%] rounded-2xl glassmorphism overflow-hidden",
            "transition-all duration-300",
            "hover:translate-y-[-2px]",
            `bg-gradient-to-br ${themeConfigs[theme].gradient}`
          )}>
            {sidePanel === 'history' && (
              <HistoryPanel 
                history={history} 
                onClearHistory={() => setHistory([])} 
                onUseResult={(result) => {
                  setDisplayValue(result);
                  setWaitingForOperand(false);
                }}
                theme={theme}
                themeConfigs={themeConfigs}
              />
            )}
            
            {sidePanel === 'memory' && (
              <MemoryPanel 
                memory={memory} 
                onClearMemory={() => setMemory([])} 
                onUseMemory={(value) => {
                  setDisplayValue(value);
                  setWaitingForOperand(false);
                }}
                theme={theme}
                themeConfigs={themeConfigs}
              />
            )}
            
            {sidePanel === 'converter' && (
              <div className="p-4 space-y-4">
                <UnitConverter />
                <CurrencyConverter />
                <AgeCalculator theme={theme} themeConfigs={themeConfigs} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-white/50 hover:text-white/70 transition-colors duration-300 text-sm">
        <p>.calc © 2025 - Clean, modern calculator with just the right features.</p>
      </div>
    </div>
  );
};

export default Calculator;
