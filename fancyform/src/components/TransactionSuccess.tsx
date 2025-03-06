import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  fromAmount: string;
  toAmount: string;
  fromCrypto: string;
  toCrypto: string;
}

export function TransactionSuccess({
  isOpen,
  onClose,
  fromAmount,
  toAmount,
  fromCrypto,
  toCrypto,
}: TransactionSuccessProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6 bg-background/95 backdrop-blur-md border border-foreground/10 shadow-xl">
        <DialogTitle></DialogTitle>
        <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-green-500/30" />
            </div>
            <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-green-500" />
          </div>

          <h2 className="text-xl font-bold mt-4">Swap Successful!</h2>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              You have successfully swapped
            </p>
            <p className="text-lg font-medium">
              {fromAmount} {fromCrypto}
              <span className="mx-2">→</span>
              {toAmount} {toCrypto}
            </p>
          </div>

          <div className="w-full mt-6">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
