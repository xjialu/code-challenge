/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import Image from "next/image";

interface TokenDisplayProps {
  symbol: string;
}

export function TokenDisplay({ symbol }: TokenDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when symbol changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [symbol]);

  // Generate a color based on the symbol for consistent fallback colors
  const getSymbolColor = (symbol: string) => {
    const colors = [
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // amber
      "#ef4444", // red
    ];

    // Simple hash function to get consistent color for each symbol
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-5 h-5">
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
        )}
        {hasError ? (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
            style={{ backgroundColor: getSymbolColor(symbol) }}
          >
            {symbol.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Image
            src={`/${symbol.toLowerCase()}.svg`}
            alt={symbol}
            width={20}
            height={20}
            className="rounded-full"
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            unoptimized={true}
          />
        )}
      </div>
      {symbol}
    </div>
  );
}
