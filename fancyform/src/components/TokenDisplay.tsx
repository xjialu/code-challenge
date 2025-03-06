/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import Image from "next/image";

interface TokenDisplayProps {
  symbol: string;
}

export function TokenDisplay({ symbol }: TokenDisplayProps) {
  const [imgSrc, setImgSrc] = useState(`/tokens/${symbol.toLowerCase()}.svg`);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImgSrc(`/tokens/${symbol.toLowerCase()}.svg`);
  }, [symbol]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-5 h-5">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={symbol}
          width={20}
          height={20}
          className="rounded-full"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(
              `https://via.placeholder.com/20?text=${symbol.charAt(0)}`
            );
            setIsLoading(false);
          }}
        />
      </div>
      {symbol}
    </div>
  );
}
