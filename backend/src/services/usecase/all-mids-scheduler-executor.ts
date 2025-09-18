import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { Injectable, Logger } from '@nestjs/common';
import { AllMids } from '@nktkas/hyperliquid';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { AdvanceTriggerStatus, AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { TriggerDirection } from '@/dtos/executor.dto';
import { ExecuteOrderUseCase } from './execute-order.usecase';

@Injectable()
export class AllMidsSchedulerExecutor {
    private readonly logger = new Logger(AllMidsSchedulerExecutor.name);
    private readonly processingTriggers = new Set<string>();

    constructor(
        private readonly hyperliquidService: HyperliquidService,
        private readonly advanceTriggerRepository: AdvanceTriggerRepository,
        private readonly executeOrderUseCase: ExecuteOrderUseCase,
    ) {
        this.hyperliquidService.addAllMidsCallback(this.execute.bind(this));
    }

    public async execute(allMids: AllMids): Promise<void> {
        try {
            // Fetch all pending advance triggers for asset price triggers
            const pendingTriggers = await this.advanceTriggerRepository.findByStatus(AdvanceTriggerStatus.PENDING);

            const assetPriceTriggers = pendingTriggers.filter(trigger =>
                trigger.trigger_type === AdvanceTriggerType.ASSET_PRICE
            );

            // Filter out triggers that are already being processed
            const availableTriggers = assetPriceTriggers.filter(trigger =>
                !this.processingTriggers.has(trigger.id)
            );

            this.logger.log(`Processing ${availableTriggers.length} available asset price triggers from ${assetPriceTriggers.length} relevant (${pendingTriggers.length} total pending)`);

            // Process triggers in parallel
            const processingPromises = availableTriggers.map(trigger =>
                this.processAssetPriceTrigger(trigger, allMids)
            );

            await Promise.allSettled(processingPromises);
        } catch (error) {
            this.logger.error('Failed to execute all mids scheduler:', error);
        }
    }

    private async processAssetPriceTrigger(advanceTrigger: any, allMids: AllMids): Promise<void> {
        // Mark trigger as being processed
        this.processingTriggers.add(advanceTrigger.id);

        try {
            if (!advanceTrigger.trigger_asset) {
                this.logger.warn(`No trigger asset specified for advance trigger ${advanceTrigger.id}`);
                return;
            }

            // Find the current price for the asset
            const currentPrice = allMids[advanceTrigger.trigger_asset];

            if (currentPrice === undefined) {
                this.logger.warn(`Price not found for asset ${advanceTrigger.trigger_asset} in advance trigger ${advanceTrigger.id}`);
                return;
            }

            if (advanceTrigger.trigger_value === null || advanceTrigger.trigger_direction === null) {
                this.logger.warn(`Missing trigger value or direction for advance trigger ${advanceTrigger.id}`);
                return;
            }

            const priceValue = parseFloat(currentPrice);
            let shouldTrigger = false;

            // Check if trigger condition is met
            if (advanceTrigger.trigger_direction === TriggerDirection.MORE_THAN) {
                shouldTrigger = priceValue > advanceTrigger.trigger_value;
            } else if (advanceTrigger.trigger_direction === TriggerDirection.LESS_THAN) {
                shouldTrigger = priceValue < advanceTrigger.trigger_value;
            }

            if (shouldTrigger) {
                this.logger.log(`Asset price trigger condition met for advance trigger ${advanceTrigger.id}: ${priceValue} ${advanceTrigger.trigger_direction} ${advanceTrigger.trigger_value}`);
                
                // Load the trading order for this trigger
                const triggerWithOrder = await this.advanceTriggerRepository.findWithTradingOrder(advanceTrigger.id);
                
                if (!triggerWithOrder?.tradingOrder) {
                    this.logger.error(`No trading order found for advance trigger ${advanceTrigger.id}`);
                    return;
                }
                
                const result = await this.executeOrderUseCase.execute({ 
                    advanceTrigger: triggerWithOrder,
                    tradingOrder: triggerWithOrder.tradingOrder,
                    triggeredValue: priceValue
                });
                
                if (result.success) {
                    this.logger.log(`Asset price trigger ${advanceTrigger.id} executed successfully with txn hash: ${result.externalTxnHash}`);
                } else {
                    this.logger.error(`Asset price trigger ${advanceTrigger.id} failed: ${result.error}`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to process advance trigger ${advanceTrigger.id}:`, error);
        } finally {
            // Remove trigger from processing set
            this.processingTriggers.delete(advanceTrigger.id);
        }
    }
}