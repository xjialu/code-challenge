"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberFlowGroup } from "@number-flow/react";
import { ArrowDown } from "lucide-react";
import { SwapConfirmModal } from "@/components/ConfirmModal";
import { TokenInput } from "@/components/TokenInput";

interface PriceData {
  currency: string;
  price: number;
  date: string;
}

export function Swap() {
  const [fromCrypto, setFromCrypto] = useState("ETH");
  const [toCrypto, setToCrypto] = useState("WBTC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Calculate USD values
  const fromUsdValue =
    Number(fromAmount) *
    (prices.find((p) => p.currency === fromCrypto)?.price || 0);
  const toUsdValue =
    Number(toAmount) *
    (prices.find((p) => p.currency === toCrypto)?.price || 0);

  // Fetch prices and set available currencies
  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        // Get latest price for each currency
        const priceMap = new Map<string, PriceData>();
        data.forEach((item: PriceData) => {
          if (
            !priceMap.has(item.currency) ||
            new Date(data[item.currency]?.date) < new Date(item.date)
          ) {
            priceMap.set(item.currency, item);
          }
        });
        const latestPrices = Array.from(priceMap.values());
        setPrices(latestPrices);
        setAvailableCurrencies(latestPrices.map((p) => p.currency));
      });
  }, []);

  // Convert between currencies
  const convertAmount = (
    amount: string,
    fromCurrency: string,
    toCurrency: string
  ): string => {
    if (!amount || isNaN(Number(amount))) return "";

    const fromPrice =
      prices.find((p) => p.currency === fromCurrency)?.price || 0;
    const toPrice = prices.find((p) => p.currency === toCurrency)?.price || 0;

    if (fromPrice && toPrice) {
      const valueInUSD = Number(amount) * fromPrice;
      const convertedAmount = valueInUSD / toPrice;
      return convertedAmount.toFixed(8);
    }
    return "";
  };

  // Handle input changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(convertAmount(value, fromCrypto, toCrypto));
  };

  const handleSwapDirection = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Calculate exchange rate between two currencies
  const calculateExchangeRate = (
    fromCurrency: string,
    toCurrency: string
  ): number => {
    const fromPrice =
      prices.find((p) => p.currency === fromCurrency)?.price || 0;
    const toPrice = prices.find((p) => p.currency === toCurrency)?.price || 0;

    if (fromPrice && toPrice) {
      // Exchange rate: how many units of toCurrency you get for 1 unit of fromCurrency
      return fromPrice / toPrice;
    }
    return 0;
  };

  const handleSwapClick = () => {
    if (fromAmount && toAmount) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmSwap = () => {
    // console.log("Swap confirmed!", {
    //   from: { amount: fromAmount, currency: fromCrypto },
    //   to: { amount: toAmount, currency: toCrypto },
    // });
    // setIsConfirmModalOpen(false);

    // Reset form after successful swap
    setFromAmount("");
    setToAmount("");
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center p-4 w-full max-w-md">
      <div className="w-full relative">
        <NumberFlowGroup>
          <TokenInput
            label="From"
            value={fromCrypto}
            amount={fromAmount}
            usdValue={fromUsdValue}
            currencies={availableCurrencies}
            onTokenChange={setFromCrypto}
            onAmountChange={handleFromAmountChange}
          />

          <div className="p-2 flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background shadow-md hover:shadow-lg transition-all duration-300 hover:bg-secondary/10 border-secondary/20"
              onClick={handleSwapDirection}
            >
              <ArrowDown className="h-4 w-4" />
              <span className="sr-only">Switch tokens</span>
            </Button>
          </div>

          <TokenInput
            label="To"
            value={toCrypto}
            amount={toAmount}
            usdValue={toUsdValue}
            currencies={availableCurrencies}
            onTokenChange={setToCrypto}
            readOnly
          />
        </NumberFlowGroup>
      </div>

      <Button
        className="w-full mt-6 h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
        onClick={handleSwapClick}
        disabled={!fromAmount || !toAmount || Number(fromAmount) === 0}
      >
        {!fromAmount || !toAmount ? "Enter an amount" : "Swap"}
      </Button>

      <SwapConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSwap}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
        fromAmount={fromAmount}
        toAmount={toAmount}
        fromUsdValue={fromUsdValue}
        exchangeRate={calculateExchangeRate(fromCrypto, toCrypto)}
      />
    </div>
  );
}
