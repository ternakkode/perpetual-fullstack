-- New Schema Design: Separated Trading Orders, Schedulers, and Advance Triggers

-- ===== ENUMS =====
CREATE TYPE execution_type AS ENUM (
    'PERPETUAL',
    'SPOT'
);

CREATE TYPE trading_order_status AS ENUM (
    'PENDING',
    'EXECUTED', 
    'FAILED',
    'CANCELED'
);

CREATE TYPE scheduler_trigger_type AS ENUM (
    'SCHEDULED',
    'CRON'
);

CREATE TYPE scheduler_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'COMPLETED',
    'CANCELED',
    'FAILED'
);

CREATE TYPE advance_trigger_type AS ENUM (
    'ASSET_PRICE',
    'VOLUME', 
    'OPEN_INTEREST',
    'DAY_CHANGE_PERCENTAGE'
);

CREATE TYPE advance_trigger_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'TRIGGERED',
    'CANCELED',
    'FAILED'
);

CREATE TYPE trigger_direction AS ENUM (
    'MORE_THAN',
    'LESS_THAN'
);

CREATE TYPE registration_type AS ENUM (
    'PUBLIC',
    'COMMUNITY'
);

-- ===== TABLES =====

-- Core trading execution details (shared by schedulers and triggers)
CREATE TABLE trading_orders (
    id VARCHAR PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    execution_type execution_type NOT NULL,
    perpetual_side VARCHAR(4) NOT NULL CHECK (perpetual_side IN ('BUY', 'SELL')),
    is_twap BOOLEAN NOT NULL,
    asset VARCHAR(50) NOT NULL,
    usdc_size DECIMAL(20,8) NOT NULL,
    leverage DECIMAL(10,2) NOT NULL,
    twap_running_time INTEGER,
    twap_randomize BOOLEAN,
    status trading_order_status DEFAULT 'PENDING',
    external_txn_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Time-based execution (SCHEDULED, CRON)
CREATE TABLE schedulers (
    id VARCHAR PRIMARY KEY,
    trading_order_id VARCHAR NOT NULL REFERENCES trading_orders(id) ON DELETE CASCADE,
    user_address VARCHAR(42) NOT NULL,
    trigger_type scheduler_trigger_type NOT NULL,
    scheduled_at TIMESTAMPTZ,
    cron VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    status scheduler_status DEFAULT 'PENDING',
    last_executed_at TIMESTAMPTZ,
    next_execution_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints to ensure proper data based on trigger type
    CONSTRAINT schedulers_scheduled_check CHECK (
        (trigger_type = 'SCHEDULED' AND scheduled_at IS NOT NULL AND cron IS NULL) OR
        (trigger_type = 'CRON' AND cron IS NOT NULL AND scheduled_at IS NULL)
    )
);

-- Condition-based execution (market conditions)
CREATE TABLE advance_triggers (
    id VARCHAR PRIMARY KEY,
    trading_order_id VARCHAR NOT NULL REFERENCES trading_orders(id) ON DELETE CASCADE,
    user_address VARCHAR(42) NOT NULL,
    trigger_type advance_trigger_type NOT NULL,
    trigger_asset VARCHAR(50) NOT NULL,
    trigger_value DECIMAL(20,8) NOT NULL,
    trigger_direction trigger_direction NOT NULL,
    status advance_trigger_status DEFAULT 'PENDING',
    triggered_at TIMESTAMPTZ,
    triggered_value DECIMAL(20,8),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===== TRIGGERS FOR UPDATED_AT =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trading_orders_updated_at 
    BEFORE UPDATE ON trading_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedulers_updated_at 
    BEFORE UPDATE ON schedulers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advance_triggers_updated_at 
    BEFORE UPDATE ON advance_triggers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDEXES =====

-- Trading Orders indexes
CREATE INDEX idx_trading_orders_user_address ON trading_orders(user_address);
CREATE INDEX idx_trading_orders_status ON trading_orders(status);
CREATE INDEX idx_trading_orders_user_address_status ON trading_orders(user_address, status);
CREATE INDEX idx_trading_orders_created_at ON trading_orders(created_at);

-- Schedulers indexes
CREATE INDEX idx_schedulers_trading_order_id ON schedulers(trading_order_id);
CREATE INDEX idx_schedulers_user_address ON schedulers(user_address);
CREATE INDEX idx_schedulers_status ON schedulers(status);
CREATE INDEX idx_schedulers_trigger_type ON schedulers(trigger_type);
CREATE INDEX idx_schedulers_user_address_status ON schedulers(user_address, status);
CREATE INDEX idx_schedulers_scheduled_at ON schedulers(scheduled_at);
CREATE INDEX idx_schedulers_next_execution_at ON schedulers(next_execution_at);

-- Advance Triggers indexes  
CREATE INDEX idx_advance_triggers_trading_order_id ON advance_triggers(trading_order_id);
CREATE INDEX idx_advance_triggers_user_address ON advance_triggers(user_address);
CREATE INDEX idx_advance_triggers_status ON advance_triggers(status);
CREATE INDEX idx_advance_triggers_trigger_type ON advance_triggers(trigger_type);
CREATE INDEX idx_advance_triggers_user_address_status ON advance_triggers(user_address, status);
CREATE INDEX idx_advance_triggers_trigger_asset ON advance_triggers(trigger_asset);
CREATE INDEX idx_advance_triggers_status_trigger_type ON advance_triggers(status, trigger_type);

-- ===== BETA REGISTRATION SYSTEM =====

-- Beta registrations table for both public and community registrations
CREATE TABLE beta_registrations (
    id VARCHAR PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    registration_type registration_type NOT NULL,
    community_code VARCHAR(50),
    twitter_handle VARCHAR(100),
    tweet_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT beta_registrations_community_check CHECK (
        (registration_type = 'COMMUNITY' AND community_code IS NOT NULL) OR
        (registration_type = 'PUBLIC' AND community_code IS NULL)
    ),
    CONSTRAINT beta_registrations_public_twitter_check CHECK (
        (registration_type = 'PUBLIC' AND twitter_handle IS NOT NULL AND tweet_url IS NOT NULL) OR
        (registration_type = 'COMMUNITY')
    )
);

-- Communities table for managing registration limits
CREATE TABLE beta_communities (
    id VARCHAR PRIMARY KEY,
    community_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    registration_limit INTEGER NOT NULL DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add triggers for updated_at
CREATE TRIGGER update_beta_registrations_updated_at 
    BEFORE UPDATE ON beta_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beta_communities_updated_at 
    BEFORE UPDATE ON beta_communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Beta Registration indexes
CREATE INDEX idx_beta_registrations_wallet_address ON beta_registrations(wallet_address);
CREATE INDEX idx_beta_registrations_registration_type ON beta_registrations(registration_type);
CREATE INDEX idx_beta_registrations_community_code ON beta_registrations(community_code);
CREATE INDEX idx_beta_registrations_type_community ON beta_registrations(registration_type, community_code);
CREATE INDEX idx_beta_registrations_created_at ON beta_registrations(created_at);

-- Beta Communities indexes
CREATE INDEX idx_beta_communities_community_code ON beta_communities(community_code);
CREATE INDEX idx_beta_communities_is_active ON beta_communities(is_active);
CREATE INDEX idx_beta_communities_active_code ON beta_communities(is_active, community_code);