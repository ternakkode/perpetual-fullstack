import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { GetUnifiedExecutionsUseCase } from '@/services/usecase/get-unified-executions.usecase';

interface WebSocketMessage {
  action?: 'subscribe' | 'unsubscribe';
  address: string;
  channels?: string[]; // Optional: specific channels to subscribe to
}

interface WebSocketResponse {
  channel: string;
  data: any;
  timestamp: Date;
}

interface ClientConnection {
  socket: WebSocket;
  address: string | null;
  subscribedChannels: Set<string>;
}

@WebSocketGateway({ path: '/ws' })
export class TradingWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TradingWebSocketGateway.name);
  private clients = new Map<WebSocket, ClientConnection>();

  // Available channels
  private readonly CHANNELS = {
    SCHEDULERS: 'schedulers',
    ADVANCE_TRIGGERS: 'advance-triggers',
    ALL: 'all' // Sends all data types
  } as const;

  constructor(
    private readonly getUnifiedExecutionsUseCase: GetUnifiedExecutionsUseCase,
  ) {}

  handleConnection(client: WebSocket) {
    this.logger.log('Trading WebSocket client connected');
    
    // Initialize client with no address and no subscriptions
    this.clients.set(client, {
      socket: client,
      address: null,
      subscribedChannels: new Set()
    });
    
    client.on('message', async (message: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const messageStr = message.toString();
        const parsedMessage: WebSocketMessage = JSON.parse(messageStr);
        
        if (!parsedMessage.address) {
          client.send(JSON.stringify({ error: 'Address is required' }));
          return;
        }

        const action = parsedMessage.action || 'subscribe';

        if (action === 'subscribe') {
          await this.handleSubscription(client, parsedMessage);
        } else if (action === 'unsubscribe') {
          await this.handleUnsubscription(client, parsedMessage);
        } else {
          client.send(JSON.stringify({ error: 'Invalid action. Use "subscribe" or "unsubscribe"' }));
        }
        
      } catch (error) {
        this.logger.error('Error processing message:', error);
        client.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log('Trading WebSocket client disconnected');
    this.clients.delete(client);
  }

  private async handleSubscription(client: WebSocket, message: WebSocketMessage) {
    const connection = this.clients.get(client);
    if (!connection) return;

    // Determine channels to subscribe to
    let channelsToSubscribe: string[] = [];
    
    if (message.channels && message.channels.length > 0) {
      // Specific channels requested
      channelsToSubscribe = message.channels.filter(channel => 
        Object.values(this.CHANNELS).includes(channel as any)
      );
    } else {
      // Default to all channels if none specified
      channelsToSubscribe = [this.CHANNELS.ALL];
    }

    // Update client connection
    this.clients.set(client, {
      socket: client,
      address: message.address,
      subscribedChannels: new Set(channelsToSubscribe)
    });

    this.logger.log(`Client subscribed to address: ${message.address}, channels: ${channelsToSubscribe.join(', ')}`);

    // Send initial data for subscribed channels
    await this.sendInitialData(client, message.address, channelsToSubscribe);
    
    client.send(JSON.stringify({ 
      success: true, 
      message: `Subscribed to address: ${message.address}`,
      channels: channelsToSubscribe,
      timestamp: new Date()
    }));
  }

  private async handleUnsubscription(client: WebSocket, message: WebSocketMessage) {
    const connection = this.clients.get(client);
    if (!connection || connection.address !== message.address) {
      client.send(JSON.stringify({ 
        error: `Not subscribed to address: ${message.address}` 
      }));
      return;
    }

    // Update client to have no address and clear subscriptions
    this.clients.set(client, {
      socket: client,
      address: null,
      subscribedChannels: new Set()
    });

    this.logger.log(`Client unsubscribed from address: ${message.address}`);
    
    client.send(JSON.stringify({ 
      success: true, 
      message: `Unsubscribed from address: ${message.address}`,
      timestamp: new Date()
    }));
  }

  private async sendInitialData(client: WebSocket, address: string, channels: string[]) {
    try {
      for (const channel of channels) {
        if (channel === this.CHANNELS.ALL) {
          // Send all channel data
          await this.sendSchedulersData(client, address);
          await this.sendAdvanceTriggersData(client, address);
        } else {
          await this.sendChannelData(client, address, channel);
        }
      }
    } catch (error) {
      this.logger.error(`Error sending initial data to client for address ${address}:`, error);
      client.send(JSON.stringify({ 
        error: 'Failed to fetch initial data',
        timestamp: new Date()
      }));
    }
  }

  private async sendChannelData(client: WebSocket, address: string, channel: string) {
    switch (channel) {
      case this.CHANNELS.SCHEDULERS:
        await this.sendSchedulersData(client, address);
        break;
      case this.CHANNELS.ADVANCE_TRIGGERS:
        await this.sendAdvanceTriggersData(client, address);
        break;
      default:
        this.logger.warn(`Unknown channel: ${channel}`);
        return;
    }
  }

  private async sendSchedulersWithTradingOrdersData(client: WebSocket, address: string) {
    try {
      // Get unified executions which include both schedulers and their trading order data
      const unifiedExecutions = await this.getUnifiedExecutionsUseCase.execute({ 
        userAddress: address,
        triggerType: 'SCHEDULER' // Only scheduler-based executions
      });
      
      // Format for schedulers channel but include trading order data
      const schedulersWithTradingOrders = unifiedExecutions.executions
        .filter(execution => execution.scheduler) // Only those with schedulers
        .map(execution => ({
          // Scheduler data
          scheduler: execution.scheduler,
          // Include trading order data
          tradingOrder: execution.tradingOrder
        }));

      this.sendMessage(client, this.CHANNELS.SCHEDULERS, { 
        schedulers: schedulersWithTradingOrders,
        total: schedulersWithTradingOrders.length 
      });
    } catch (error) {
      this.logger.error(`Error fetching schedulers with trading orders for address ${address}:`, error);
      this.sendMessage(client, this.CHANNELS.SCHEDULERS, { error: 'Failed to fetch schedulers' });
    }
  }

  private async sendSchedulersData(client: WebSocket, address: string) {
    await this.sendSchedulersWithTradingOrdersData(client, address);
  }

  private async sendAdvanceTriggersData(client: WebSocket, address: string) {
    try {
      // Get unified executions which include both advance triggers and their trading order data
      const unifiedExecutions = await this.getUnifiedExecutionsUseCase.execute({ 
        userAddress: address,
        triggerType: 'ADVANCE_TRIGGER' // Only advance trigger-based executions
      });
      
      // Format for advance triggers channel but include trading order data
      const advanceTriggersWithTradingOrders = unifiedExecutions.executions
        .filter(execution => execution.advanceTrigger) // Only those with advance triggers
        .map(execution => ({
          // Advance trigger data
          advanceTrigger: execution.advanceTrigger,
          // Include trading order data
          tradingOrder: execution.tradingOrder
        }));

      this.sendMessage(client, this.CHANNELS.ADVANCE_TRIGGERS, { 
        advanceTriggers: advanceTriggersWithTradingOrders,
        total: advanceTriggersWithTradingOrders.length 
      });
    } catch (error) {
      this.logger.error(`Error fetching advance triggers with trading orders for address ${address}:`, error);
      this.sendMessage(client, this.CHANNELS.ADVANCE_TRIGGERS, { error: 'Failed to fetch advance triggers' });
    }
  }


  private sendMessage(client: WebSocket, channel: string, data: any) {
    const message: WebSocketResponse = {
      channel,
      data,
      timestamp: new Date()
    };
    
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  // Public methods to trigger real-time updates

  /**
   * Refresh schedulers (with trading order data) for a specific address
   */
  async refreshSchedulersForAddress(address: string) {
    this.logger.log(`Refreshing schedulers for address: ${address}`);
    await this.refreshChannelForAddress(address, this.CHANNELS.SCHEDULERS);
  }

  /**
   * Refresh advance triggers (with trading order data) for a specific address
   */
  async refreshAdvanceTriggersForAddress(address: string) {
    this.logger.log(`Refreshing advance triggers for address: ${address}`);
    await this.refreshChannelForAddress(address, this.CHANNELS.ADVANCE_TRIGGERS);
  }


  /**
   * Refresh all channels for a specific address
   */
  async refreshAllForAddress(address: string) {
    this.logger.log(`Refreshing all channels for address: ${address}`);
    
    for (const [client, connection] of this.clients.entries()) {
      if (connection.address === address && client.readyState === WebSocket.OPEN) {
        if (connection.subscribedChannels.has(this.CHANNELS.ALL)) {
          // Client subscribed to all channels
          await this.sendSchedulersData(client, address);
          await this.sendAdvanceTriggersData(client, address);
        } else {
          // Client subscribed to specific channels
          for (const channel of connection.subscribedChannels) {
            await this.sendChannelData(client, address, channel);
          }
        }
      }
    }
  }

  /**
   * Refresh a specific channel for an address
   */
  private async refreshChannelForAddress(address: string, channel: string) {
    for (const [client, connection] of this.clients.entries()) {
      if (connection.address === address && 
          client.readyState === WebSocket.OPEN && 
          (connection.subscribedChannels.has(channel) || connection.subscribedChannels.has(this.CHANNELS.ALL))) {
        await this.sendChannelData(client, address, channel);
      }
    }
  }

  /**
   * Get connected clients count for monitoring
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get subscribed addresses for monitoring
   */
  getSubscribedAddresses(): string[] {
    const addresses = new Set<string>();
    for (const connection of this.clients.values()) {
      if (connection.address) {
        addresses.add(connection.address);
      }
    }
    return Array.from(addresses);
  }
}