import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { Injectable, Logger } from '@nestjs/common';
import { AllMids } from '@nktkas/hyperliquid';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { AdvanceTrigger, AdvanceTriggerStatus, AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { TriggerDirection } from '@/dtos/executor.dto';
import { ExecuteOrderUseCase } from './execute-order.usecase';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';

@Injectable()
export class AssetPriceSchedulerUseCase {
    private readonly logger = new Logger(AssetPriceSchedulerUseCase.name);
    private readonly processingTriggers = new Set<string>();

    constructor(
        private readonly hyperliquidService: HyperliquidService,
        private readonly advanceTriggerRepository: AdvanceTriggerRepository,
        private readonly tradingOrderRepository: TradingOrderRepository,
        private readonly executeOrderUseCase: ExecuteOrderUseCase,
        private readonly tradingWebSocketGateway: TradingWebSocketGateway,
    ) {
        this.hyperliquidService.addAllMidsCallback(this.execute.bind(this));
    }

    public async execute(allMids: AllMids): Promise<void> {
        try {
            // Fetch all pending asset price advance triggers
            const pendingTriggers = await this.advanceTriggerRepository.findByStatusAndTriggerType(
                AdvanceTriggerStatus.PENDING,
                AdvanceTriggerType.ASSET_PRICE
            );

            // Filter out triggers that are already being processed
            const availableTriggers = pendingTriggers.filter(trigger =>
                !this.processingTriggers.has(trigger.id)
            );

            this.logger.log(`Processing ${availableTriggers.length} available asset price triggers from ${pendingTriggers.length} total pending`);

            // Process triggers in parallel
            const processingPromises = availableTriggers.map(trigger =>
                this.processAssetPriceTrigger(trigger, allMids)
            );

            await Promise.allSettled(processingPromises);
        } catch (error) {
            this.logger.error('Failed to execute asset price scheduler:', error);
        }
    }

    private async processAssetPriceTrigger(advanceTrigger: AdvanceTrigger, allMids: AllMids): Promise<void> {
        // Mark trigger as being processed
        this.processingTriggers.add(advanceTrigger.id);

        try {
            // Find the current price for the asset
            const currentPrice = allMids[advanceTrigger.trigger_asset];

            if (currentPrice === undefined) {
                this.logger.warn(`Price not found for asset ${advanceTrigger.trigger_asset} in trigger ${advanceTrigger.id}`);
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
                this.logger.log(`Asset price trigger condition met for trigger ${advanceTrigger.id}: ${priceValue} ${advanceTrigger.trigger_direction} ${advanceTrigger.trigger_value}`);
                
                // Update trigger status to triggered
                await this.advanceTriggerRepository.update(advanceTrigger.id, {
                    status: AdvanceTriggerStatus.TRIGGERED,
                    triggered_at: new Date(),
                    triggered_value: priceValue,
                });

                // Get the associated trading order
                const tradingOrder = await this.tradingOrderRepository.findById(advanceTrigger.trading_order_id);
                
                if (!tradingOrder) {
                    this.logger.error(`Trading order ${advanceTrigger.trading_order_id} not found for trigger ${advanceTrigger.id}`);
                    return;
                }

                if (tradingOrder.status !== TradingOrderStatus.PENDING) {
                    this.logger.warn(`Trading order ${tradingOrder.id} is not in PENDING status (${tradingOrder.status}). Skipping execution.`);
                    return;
                }

                // Execute the order using the new advance trigger approach
                const result = await this.executeOrderUseCase.execute({ 
                    advanceTrigger: advanceTrigger,
                    tradingOrder: tradingOrder,
                    triggeredValue: parseFloat(currentPrice)
                });
                
                if (result.success) {
                    this.logger.log(`Asset price trigger ${advanceTrigger.id} executed successfully with txn hash: ${result.externalTxnHash}`);
                } else {
                    this.logger.error(`Asset price trigger ${advanceTrigger.id} failed: ${result.error}`);
                }
                // Note: ExecuteOrderUseCase handles all status updates and WebSocket notifications
            }
        } catch (error) {
            this.logger.error(`Failed to process asset price trigger ${advanceTrigger.id}:`, error);
            
            // Update trigger status to failed
            try {
                await this.advanceTriggerRepository.update(advanceTrigger.id, {
                    status: AdvanceTriggerStatus.FAILED,
                });
            } catch (updateError) {
                this.logger.error(`Failed to update trigger ${advanceTrigger.id} status to FAILED:`, updateError);
            }
        } finally {
            // Remove trigger from processing set
            this.processingTriggers.delete(advanceTrigger.id);
        }
    }

}