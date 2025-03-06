import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenDisplay } from "@/components/TokenDisplay";
import NumberFlow from "@number-flow/react";

interface TokenInputProps {
  label: string;
  value: string;
  amount: string;
  usdValue: number;
  currencies: string[];
  readOnly?: boolean;
  onTokenChange: (value: string) => void;
  onAmountChange?: (value: string) => void;
}

export function TokenInput({
  label,
  value,
  amount,
  usdValue,
  currencies,
  readOnly = false,
  onTokenChange,
  onAmountChange,
}: TokenInputProps) {
  return (
    <Card className="w-full border-foreground/10 hover:border-foreground/20 transition-colors duration-300 hover:shadow-lg hover:shadow-purple-500/5">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500/70 to-pink-500/70">
            {label}
          </span>
          <Select value={value} onValueChange={onTokenChange}>
            <SelectTrigger className="border-none bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 rounded-lg px-4 py-2 min-w-[140px] font-medium">
              <SelectValue>
                <TokenDisplay symbol={value} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto backdrop-blur-md border border-foreground/10">
              {currencies.map((currency) => (
                <SelectItem
                  key={currency}
                  value={currency}
                  className="hover:bg-purple-500/10 transition-colors"
                >
                  <TokenDisplay symbol={currency} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center space-x-4 relative">
          <div className="flex-1 group">
            {readOnly ? (
              <div className="bg-transparent outline-none text-2xl font-medium w-full group-hover:text-purple-500 transition-colors">
                {amount ? (
                  <NumberFlow
                    value={Number(amount)}
                    format={{ maximumFractionDigits: 4 }}
                    transformTiming={{ duration: 500 }}
                  />
                ) : (
                  <span className="text-muted-foreground">0.0</span>
                )}
              </div>
            ) : (
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => onAmountChange?.(e.target.value)}
                className="bg-transparent border-none outline-none text-2xl font-medium w-full focus:ring-0 placeholder:text-muted-foreground/50 hover:placeholder:text-muted-foreground transition-colors focus:text-purple-500"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap font-medium bg-secondary/20 px-3 py-1 rounded-full">
            ≈ ${usdValue.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
