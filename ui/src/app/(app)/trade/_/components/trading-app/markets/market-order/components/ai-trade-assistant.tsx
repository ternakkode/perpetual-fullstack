"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Zap } from "@untitled-ui/icons-react";

export interface AISuggestion {
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AIAssistantState {
  isLoading: boolean;
  suggestion: AISuggestion | null;
  usageCount: number;
  maxUsage: number;
  lastUsedAt: number | null;
}

interface AITradeAssistantProps {
  aiAssistant: AIAssistantState;
  canUseAI: boolean;
  onRequestSuggestion: () => Promise<void>;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: () => void;
}

export function AITradeAssistant({
  aiAssistant,
  canUseAI,
  onRequestSuggestion,
  onApplySuggestion,
  onDismissSuggestion
}: AITradeAssistantProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white-96">AI Trade Assistant</span>
        </div>
        <div className="text-xs text-white-48">
          {aiAssistant.usageCount}/{aiAssistant.maxUsage} daily uses
        </div>
      </div>

      {!aiAssistant.suggestion && !aiAssistant.isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRequestSuggestion}
          disabled={!canUseAI}
          className="w-full h-8 text-xs bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50"
        >
          {canUseAI ? (
            <>
              <Zap className="w-3 h-3 mr-1" />
              Get AI Suggestion
            </>
          ) : (
            'Daily limit reached'
          )}
        </Button>
      )}

      {aiAssistant.isLoading && (
        <div className="flex items-center justify-center h-8 text-xs text-white-64">
          <div className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full mr-2"></div>
          AI analyzing market conditions...
        </div>
      )}

      {aiAssistant.suggestion && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
          <div className="text-xs text-white-96 leading-relaxed">
            {aiAssistant.suggestion.reasoning}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onApplySuggestion(aiAssistant.suggestion!)}
              className="h-7 px-3 text-xs bg-blue-500 hover:bg-blue-600"
            >
              Apply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismissSuggestion}
              className="h-7 px-3 text-xs text-white-64 hover:text-white-96"
            >
              Dismiss
            </Button>
            <div className={`ml-auto text-xs px-2 py-1 rounded-full ${
              aiAssistant.suggestion.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
              aiAssistant.suggestion.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {aiAssistant.suggestion.riskLevel} risk
            </div>
          </div>
        </div>
      )}
    </div>
  );
}