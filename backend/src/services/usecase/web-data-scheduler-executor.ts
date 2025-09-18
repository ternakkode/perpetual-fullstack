import { AllAssetInformation, HyperliquidService } from '@/libs/hyperliquid.libs';
import { Injectable, Logger } from '@nestjs/common';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { AdvanceTriggerStatus, AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { TriggerDirection } from '@/dtos/executor.dto';
import { ExecuteOrderUseCase } from './execute-order.usecase';

@Injectable()
export class WebDataSchedulerExecutor {
    private readonly logger = new Logger(WebDataSchedulerExecutor.name);
    private readonly processingTriggers = new Set<string>();

    constructor(
        private readonly hyperliquidService: HyperliquidService,
        private readonly advanceTriggerRepository: AdvanceTriggerRepository,
        private readonly executeOrderUseCase: ExecuteOrderUseCase,
    ) {
         this.hyperliquidService.addWebDataCallback(this.execute.bind(this));
    }

    public async execute(allAssetsInformation: AllAssetInformation[]): Promise<void> {
        try {
            // Fetch all pending advance triggers for volume, open interest, and day change percentage triggers
            const pendingTriggers = await this.advanceTriggerRepository.findByStatus(AdvanceTriggerStatus.PENDING);
            
            const relevantTriggers = pendingTriggers.filter(trigger => 
                [AdvanceTriggerType.VOLUME, AdvanceTriggerType.OPEN_INTEREST, AdvanceTriggerType.DAY_CHANGE_PERCENTAGE].includes(trigger.trigger_type)
            );

            // Filter out triggers that are already being processed
            const availableTriggers = relevantTriggers.filter(trigger => 
                !this.processingTriggers.has(trigger.id)
            );

            this.logger.log(`Processing ${availableTriggers.length} available triggers from ${relevantTriggers.length} relevant (${pendingTriggers.length} total pending)`);

            // Process triggers in parallel
            const processingPromises = availableTriggers.map(trigger => 
                this.processAdvanceTrigger(trigger, allAssetsInformation)
            );

            await Promise.allSettled(processingPromises);
        } catch (error) {
            this.logger.error('Failed to execute web data scheduler:', error);
        }
    }

    private async processAdvanceTrigger(trigger: any, allAssetsInformation: AllAssetInformation[]): Promise<void> {
        // Mark trigger as being processed
        this.processingTriggers.add(trigger.id);
        
        try {
            // Find the asset data for this trigger
            const assetData = allAssetsInformation.find(info => info.universe.name === trigger.trigger_asset);
            
            if (!assetData) {
                this.logger.warn(`Asset ${trigger.trigger_asset} not found for advance trigger ${trigger.id}`);
                return;
            }

            let currentValue: number | null = null;
            let shouldTrigger = false;

            // Extract the relevant metric based on trigger type
            switch (trigger.trigger_type) {
                case AdvanceTriggerType.VOLUME:
                    currentValue = parseFloat(assetData.assetsCtx.dayNtlVlm);
                    break;
                case AdvanceTriggerType.OPEN_INTEREST:
                    currentValue = parseFloat(assetData.assetsCtx.openInterest);
                    break;
                case AdvanceTriggerType.DAY_CHANGE_PERCENTAGE:
                    // Calculate day change percentage from fundingRate or other available data
                    const fundingRate = parseFloat(assetData.assetsCtx.funding);
                    currentValue = fundingRate * 100; // Convert to percentage
                    break;
            }

            if (currentValue === null || trigger.trigger_value === null) {
                return;
            }

            // Check if trigger condition is met
            if (trigger.trigger_direction === TriggerDirection.MORE_THAN) {
                shouldTrigger = currentValue > trigger.trigger_value;
            } else if (trigger.trigger_direction === TriggerDirection.LESS_THAN) {
                shouldTrigger = currentValue < trigger.trigger_value;
            }

            if (shouldTrigger) {
                this.logger.log(`Trigger condition met for advance trigger ${trigger.id}: ${currentValue} ${trigger.trigger_direction} ${trigger.trigger_value}`);
                
                // Load the trading order for this trigger
                const triggerWithOrder = await this.advanceTriggerRepository.findWithTradingOrder(trigger.id);
                
                if (!triggerWithOrder?.tradingOrder) {
                    this.logger.error(`No trading order found for advance trigger ${trigger.id}`);
                    return;
                }
                
                const result = await this.executeOrderUseCase.execute({ 
                    advanceTrigger: triggerWithOrder,
                    tradingOrder: triggerWithOrder.tradingOrder,
                    triggeredValue: currentValue
                });
                
                if (result.success) {
                    this.logger.log(`Advance trigger ${trigger.id} executed successfully with txn hash: ${result.externalTxnHash}`);
                } else {
                    this.logger.error(`Advance trigger ${trigger.id} failed: ${result.error}`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to process advance trigger ${trigger.id}:`, error);
        } finally {
            // Remove trigger from processing set
            this.processingTriggers.delete(trigger.id);
        }
    }
}