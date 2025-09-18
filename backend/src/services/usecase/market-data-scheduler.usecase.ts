import { AllAssetInformation, HyperliquidService } from '@/libs/hyperliquid.libs';
import { Injectable, Logger } from '@nestjs/common';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { AdvanceTriggerStatus, AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { TriggerDirection } from '@/dtos/executor.dto';
import { ExecuteOrderUseCase } from './execute-order.usecase';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';

@Injectable()
export class MarketDataSchedulerUseCase {
    private readonly logger = new Logger(MarketDataSchedulerUseCase.name);
    private readonly processingTriggers = new Set<string>();

    constructor(
        private readonly hyperliquidService: HyperliquidService,
        private readonly advanceTriggerRepository: AdvanceTriggerRepository,
        private readonly tradingOrderRepository: TradingOrderRepository,
        private readonly executeOrderUseCase: ExecuteOrderUseCase,
        private readonly tradingWebSocketGateway: TradingWebSocketGateway,
    ) {
         this.hyperliquidService.addWebDataCallback(this.execute.bind(this));
    }

    public async execute(allAssetsInformation: AllAssetInformation[]): Promise<void> {
        try {
            // Fetch all pending advance triggers for volume, open interest, and day change percentage
            const pendingTriggers = await this.advanceTriggerRepository.findActiveMarketDataTriggers();

            // Filter out triggers that are already being processed
            const availableTriggers = pendingTriggers.filter(trigger => 
                !this.processingTriggers.has(trigger.id)
            );

            this.logger.log(`Processing ${availableTriggers.length} available market data triggers from ${pendingTriggers.length} total pending`);

            // Process triggers in parallel
            const processingPromises = availableTriggers.map(trigger => 
                this.processMarketDataTrigger(trigger, allAssetsInformation)
            );

            await Promise.allSettled(processingPromises);
        } catch (error) {
            this.logger.error('Failed to execute market data scheduler:', error);
        }
    }

    private async processMarketDataTrigger(advanceTrigger: any, allAssetsInformation: AllAssetInformation[]): Promise<void> {
        // Mark trigger as being processed
        this.processingTriggers.add(advanceTrigger.id);
        
        try {
            // Find the asset data for this trigger
            const assetData = allAssetsInformation.find(info => info.universe.name === advanceTrigger.trigger_asset);
            
            if (!assetData) {
                this.logger.warn(`Asset ${advanceTrigger.trigger_asset} not found for trigger ${advanceTrigger.id}`);
                return;
            }

            let currentValue: number | null = null;
            let shouldTrigger = false;

            // Extract the relevant metric based on trigger type
            switch (advanceTrigger.trigger_type) {
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

            if (currentValue === null) {
                return;
            }

            // Check if trigger condition is met
            if (advanceTrigger.trigger_direction === TriggerDirection.MORE_THAN) {
                shouldTrigger = currentValue > advanceTrigger.trigger_value;
            } else if (advanceTrigger.trigger_direction === TriggerDirection.LESS_THAN) {
                shouldTrigger = currentValue < advanceTrigger.trigger_value;
            }

            if (shouldTrigger) {
                this.logger.log(`Market data trigger condition met for trigger ${advanceTrigger.id}: ${currentValue} ${advanceTrigger.trigger_direction} ${advanceTrigger.trigger_value}`);
                
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
                // The ExecuteOrderUseCase now handles all status updates and WebSocket notifications
                const result = await this.executeOrderUseCase.execute({ 
                    advanceTrigger: advanceTrigger,
                    tradingOrder: tradingOrder,
                    triggeredValue: currentValue
                });
                
                if (result.success) {
                    this.logger.log(`Market data trigger ${advanceTrigger.id} executed successfully with txn hash: ${result.externalTxnHash}`);
                } else {
                    this.logger.error(`Market data trigger ${advanceTrigger.id} failed: ${result.error}`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to process market data trigger ${advanceTrigger.id}:`, error);
        } finally {
            // Remove trigger from processing set
            this.processingTriggers.delete(advanceTrigger.id);
        }
    }

}