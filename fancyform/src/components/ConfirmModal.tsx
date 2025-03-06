"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionSuccess } from "./TransactionSuccess";

interface SwapConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromCrypto: string;
  toCrypto: string;
  fromAmount: string;
  toAmount: string;
  fromUsdValue: number;
  exchangeRate: number;
}

export function SwapConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  fromCrypto,
  toCrypto,
  fromAmount,
  toAmount,
  fromUsdValue,
  exchangeRate,
}: SwapConfirmModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDragPosition(0);
      setIsConfirmed(false);
      setShowSuccess(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  // Updated confirmation handler with confetti
  const handleConfirmation = () => {
    setIsConfirmed(true);
    setShowConfetti(true);
    onConfirm();

    // Show success modal after a short delay to let confetti appear first
    setTimeout(() => {
      setShowSuccess(true);

      // Hide confetti after success is shown
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 500);
  };

  // Update the mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const thumbWidth = 40;
    const maxPosition = sliderRect.width - thumbWidth;

    const newPosition = Math.min(
      Math.max(0, e.clientX - sliderRect.left - thumbWidth / 2),
      maxPosition
    );

    setDragPosition(newPosition);

    if (newPosition >= maxPosition * 0.9) {
      setIsDragging(false);
      handleConfirmation();
    }
  };

  // Update the touch move handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const thumbWidth = 40;
    const maxPosition = sliderRect.width - thumbWidth;

    const newPosition = Math.min(
      Math.max(0, touch.clientX - sliderRect.left - thumbWidth / 2),
      maxPosition
    );

    setDragPosition(newPosition);

    if (newPosition >= maxPosition * 0.9) {
      setIsDragging(false);
      handleConfirmation();
    }
  };

  const handleDragEnd = () => {
    if (!isConfirmed) {
      setIsDragging(false);
      const startTime = Date.now();
      const startPosition = dragPosition;
      const duration = 300;

      const animateBack = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newPosition = startPosition * (1 - easeOut);

        setDragPosition(newPosition);

        if (progress < 1) {
          requestAnimationFrame(animateBack);
        } else {
          setDragPosition(0);
        }
      };

      requestAnimationFrame(animateBack);
    }
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={100}
            recycle={false}
            colors={["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#6366f1"]}
            gravity={0.8}
            tweenDuration={2000}
            initialVelocityY={15}
            initialVelocityX={5}
          />
        </div>
      )}

      <Dialog
        open={isOpen && !showSuccess}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
            setShowSuccess(false);
            setShowConfetti(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6 bg-background/95 backdrop-blur-md border border-foreground/10 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Confirm Swap
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review and confirm your transaction
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 relative">
            <div className="flex flex-col items-center space-y-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold">
                    {fromAmount}
                  </span>
                  <span className="ml-1 text-lg sm:text-xl text-muted-foreground">
                    {fromCrypto}
                  </span>
                </div>

                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />

                <div className="flex items-center">
                  <span className="text-lg sm:text-xl font-bold">
                    {toAmount}
                  </span>
                  <span className="ml-1 text-base sm:text-xl text-muted-foreground">
                    {toCrypto}
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground">
                ≈ ${fromUsdValue.toFixed(2)} USD
              </div>
            </div>

            {/* Exchange rate */}
            <div className="text-xs sm:text-sm border-t border-b border-foreground/10 py-3 sm:py-4 px-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">
                  1 {fromCrypto} = {exchangeRate.toFixed(6)} {toCrypto}
                </span>
              </div>
            </div>

            {/* Swipe to confirm*/}
            <div
              ref={sliderRef}
              className="mt-4 sm:mt-6 h-12 sm:h-14 rounded-full bg-muted/30 border border-foreground/10 relative overflow-hidden shadow-inner"
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              {/* Progress background with gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-r blur-sm from-green-500 to-secondary/20 rounded-full origin-left"
                style={{
                  width: `${
                    (dragPosition / (sliderRef.current?.clientWidth || 1)) *
                      100 +
                    13
                  }%`,
                  transition: isDragging
                    ? "none"
                    : "width cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />

              {/* thumb */}
              <div
                ref={thumbRef}
                className={`absolute top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 bg-foreground rounded-full flex items-center justify-center cursor-grab z-10 shadow-md ${
                  isDragging ? "cursor-grabbing" : "ml-2"
                }`}
                style={{
                  left: `${dragPosition}px`,
                  transition: isDragging
                    ? "none"
                    : "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-background" />
                <div className="absolute inset-0 rounded-full dark:bg-white opacity-20 dark:animate-ping animate-pulse"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs sm:text-sm font-medium text-foreground/70">
                  Swipe to confirm
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionSuccess
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setShowConfetti(false);
          onClose();
        }}
        fromAmount={fromAmount}
        toAmount={toAmount}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
      />
    </>
  );
}
