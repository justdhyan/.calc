
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CurrencyIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.79,
  JPY: 151.62,
  INR: 83.31,
  CHF: 0.90,
  RUB: 92.50
};

type Currency = keyof typeof EXCHANGE_RATES;

const PREDEFINED_AMOUNTS = [
  "1", "5", "10", "20", "50", "100", "500", "1000"
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');

  const convert = (value: string, from: Currency, to: Currency): string => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return '';
    
    const inUSD = numericValue / EXCHANGE_RATES[from];
    const result = inUSD * EXCHANGE_RATES[to];
    return result.toFixed(2);
  };

  const handleAmountSelect = (value: string) => {
    setAmount(value);
  };

  const copyToClipboard = () => {
    if (!amount) return;
    
    const result = convert(amount, fromCurrency, toCurrency);
    navigator.clipboard.writeText(`${amount} ${fromCurrency} = ${result} ${toCurrency}`);
    toast(`Copied to clipboard: ${amount} ${fromCurrency} = ${result} ${toCurrency}`);
  };

  return (
    <div className="p-6 rounded-xl bg-dark-card/50 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-white/80 hover:text-white transition-colors">Currency Converter</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white/70 hover:text-white transition-colors">Amount</Label>
          <Select onValueChange={handleAmountSelect} value={amount}>
            <SelectTrigger className={cn(
              "w-full bg-dark-card/30 border-dark-border",
              "text-white hover:bg-dark-card/40",
              "focus:ring-0 focus:ring-offset-0",
              "transition-colors duration-200"
            )}>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-dark-border">
              {PREDEFINED_AMOUNTS.map((value) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white/70 hover:text-white transition-colors">From</Label>
            <Select value={fromCurrency} onValueChange={(value: Currency) => setFromCurrency(value)}>
              <SelectTrigger className={cn(
                "w-full bg-dark-card/30 border-dark-border",
                "text-white hover:bg-dark-card/40",
                "focus:ring-0 focus:ring-offset-0",
                "transition-colors duration-200"
              )}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border">
                {Object.keys(EXCHANGE_RATES).map((currency) => (
                  <SelectItem 
                    key={currency} 
                    value={currency}
                    className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/70 hover:text-white transition-colors">To</Label>
            <Select value={toCurrency} onValueChange={(value: Currency) => setToCurrency(value)}>
              <SelectTrigger className={cn(
                "w-full bg-dark-card/30 border-dark-border",
                "text-white hover:bg-dark-card/40",
                "focus:ring-0 focus:ring-offset-0",
                "transition-colors duration-200"
              )}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border">
                {Object.keys(EXCHANGE_RATES).map((currency) => (
                  <SelectItem 
                    key={currency} 
                    value={currency}
                    className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg bg-dark-card/20 border border-white/5 hover:border-neon-purple/30 transition-colors cursor-pointer"
          onClick={copyToClipboard}
        >
          <div className="text-sm text-white/70">Converted Amount:</div>
          <div className="text-xl font-semibold text-white/90 hover:text-white mt-1 transition-colors">
            {amount ? `${convert(amount, fromCurrency, toCurrency)} ${toCurrency}` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
