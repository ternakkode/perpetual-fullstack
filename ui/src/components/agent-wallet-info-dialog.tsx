"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Zap } from "@untitled-ui/icons-react";
import { useWalletAuth } from "@/components/wallet-auth-provider";

interface AgentWalletInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: () => void;
}

export const AgentWalletInfoDialog: React.FC<AgentWalletInfoDialogProps> = ({
  open,
  onOpenChange,
  onApprove,
}) => {
  const { setupAgentWallet, isLoading, status, error: walletError, isAgentWalletReady } = useWalletAuth();
  const [step, setStep] = useState<'info' | 'approving' | 'success' | 'error'>('info');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (isAgentWalletReady) {
      // Already ready, just close dialog
      setStep('success');
      setTimeout(() => {
        onOpenChange(false);
        setStep('info');
        onApprove?.();
      }, 1000);
      return;
    }

    setStep('approving');
    setLocalError(null);

    try {
      await setupAgentWallet();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unexpected error occurred');
      setStep('error');
    }
  };

  const handleClose = () => {
    if (step !== 'approving') {
      onOpenChange(false);
      setStep('info');
      setLocalError(null);
    }
  };

  // Watch for agent wallet becoming ready after retry
  useEffect(() => {
    if (step === 'approving' && isAgentWalletReady) {
      setStep('success');
      setTimeout(() => {
        onOpenChange(false);
        setStep('info');
        onApprove?.();
      }, 2000);
    }
  }, [isAgentWalletReady, step, onOpenChange, onApprove]);

  // Auto-close dialog if agent wallet becomes ready while dialog is open
  useEffect(() => {
    if (open && isAgentWalletReady && step === 'info') {
      onOpenChange(false);
    }
  }, [open, isAgentWalletReady, step, onOpenChange]);

  // Watch for errors from the wallet auth hook
  useEffect(() => {
    if (step === 'approving' && walletError) {
      setLocalError(walletError);
      setStep('error');
    }
  }, [walletError, step]);

  const handleRetry = () => {
    setStep('info');
    setLocalError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            {step === 'info' && 'Enable Trading'}
            {step === 'approving' && 'Setting Up Agent Wallet...'}
            {step === 'success' && 'Trading Enabled!'}
            {step === 'error' && 'Setup Failed'}
          </DialogTitle>
          <DialogDescription className="text-left">
            {step === 'info' && (
              <>To enable trading, you need to approve an agent wallet. This allows our system to execute trades on your behalf securely.</>
            )}
            {step === 'approving' && (
              <>Please approve the agent wallet transaction in your wallet. This may take a moment.</>
            )}
            {step === 'success' && (
              <>Your agent wallet has been successfully approved. You can now place trades!</>
            )}
            {step === 'error' && (
              <>There was an issue setting up your agent wallet. Please try again.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'info' && (
            <>
              <div className="space-y-3 text-sm text-white-64">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Your funds remain secure in your wallet. The agent can only execute approved trades.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Enable instant order placement without manual wallet approval for each trade.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>You can revoke agent approval anytime through the Hyperliquid UI.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1 hover:text-black"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Approve Agent Wallet
                </Button>
              </div>
            </>
          )}

          {step === 'approving' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mb-4"></div>
              <p className="text-sm text-white-64 text-center">
                Setting up your agent wallet...<br/>
                Please confirm the transaction in your wallet.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
              <p className="text-sm text-center text-white-64">
                Agent wallet approved successfully!<br/>
                You can now place trades.
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-white-96">Setup Failed</div>
                  <div className="text-white-64">{localError}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1 hover:text-black"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRetry}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
