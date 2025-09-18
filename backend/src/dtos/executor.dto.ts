
export enum TriggerType {
    AssetPrice = 'ASSET_PRICE',
    Volume = 'VOLUME',
    OpenInterest = 'OPEN_INTEREST',
    DayChangePercentage = 'DAY_CHANGE_PERCENTAGE',
    Scheduled = 'SCHEDULED',
    Cron = 'CRON'
}

export enum ExecutionType {
    PERPETUAL = 'PERPETUAL',
    SPOT = 'SPOT'
}

export enum TriggerDirection {
    MORE_THAN = 'MORE_THAN',
    LESS_THAN = 'LESS_THAN'
}

export class ExecuteTransactionTrigger {
    triggerType!: TriggerType;
    asset?: string;
    scheduledAt?: Date;
    cron?: string;
    value?: number;
    direction?: TriggerDirection;
}

export class ExecuteTransaction {
    executionType!: ExecutionType;
    perpetualSide!: 'BUY' | 'SELL';
    isTwap!: boolean;
    asset!: string;
    usdcSize!: number;
    leverage!: number;
    twapRunningTime?: number;
    twapRandomize?: boolean;
}