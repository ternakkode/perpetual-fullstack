import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, QueueEvents } from 'bullmq';
import { AppConfigService } from '@/config/app-config.service';

export interface ScheduledJobData {
  schedulerId: string;
  userAddress: string;
}

export interface CronJobData extends ScheduledJobData {
  cronExpression: string;
}

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SchedulerService.name);
  
  private scheduledQueue!: Queue<ScheduledJobData>;
  private cronQueue!: Queue<CronJobData>;
  private scheduledWorker!: Worker<ScheduledJobData>;
  private cronWorker!: Worker<CronJobData>;
  private scheduledQueueEvents!: QueueEvents;
  private cronQueueEvents!: QueueEvents;

  // Track active cron jobs to stop them on failure
  private activeCronJobs = new Map<string, { jobId: string; repeatJobKey?: string }>();

  constructor(
    private readonly appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    const redisConnection = {
      host: this.appConfigService.redisHost,
      port: this.appConfigService.redisPort,
      password: this.appConfigService.redisPassword,
      db: this.appConfigService.redisDb,
    };

    // Initialize queues
    this.scheduledQueue = new Queue<ScheduledJobData>('scheduled-executors', {
      connection: redisConnection,
    });

    this.cronQueue = new Queue<CronJobData>('cron-executors', {
      connection: redisConnection,
    });

    // Initialize queue events for monitoring
    this.scheduledQueueEvents = new QueueEvents('scheduled-executors', {
      connection: redisConnection,
    });

    this.cronQueueEvents = new QueueEvents('cron-executors', {
      connection: redisConnection,
    });

    this.logger.log('Scheduler service initialized with BullMQ');
  }

  setWorkers(
    scheduledProcessor: (job: { data: ScheduledJobData }) => Promise<void>,
    cronProcessor: (job: { data: CronJobData }) => Promise<void>
  ) {
    const redisConnection = {
      host: this.appConfigService.redisHost,
      port: this.appConfigService.redisPort,
      password: this.appConfigService.redisPassword,
      db: this.appConfigService.redisDb,
    };

    // Initialize workers
    this.scheduledWorker = new Worker<ScheduledJobData>(
      'scheduled-executors',
      async (job) => {
        try {
          await scheduledProcessor(job);
        } catch (error) {
          this.logger.error(`Scheduled job ${job.id} failed:`, error);
          throw error;
        }
      },
      { connection: redisConnection }
    );

    this.cronWorker = new Worker<CronJobData>(
      'cron-executors',
      async (job) => {
        try {
          await cronProcessor(job);
        } catch (error) {
          this.logger.error(`Cron job ${job.id} failed:`, error);
          // Stop the recurring cron job on failure
          await this.stopCronJob(job.data.schedulerId);
          throw error;
        }
      },
      { connection: redisConnection }
    );

    this.logger.log('Scheduler workers initialized');
  }

  async scheduleOneTimeJob(schedulerId: string, userAddress: string, scheduledAt: Date): Promise<string> {
    const job = await this.scheduledQueue.add(
      `scheduled-${schedulerId}`,
      { schedulerId, userAddress },
      {
        delay: scheduledAt.getTime() - Date.now(),
        removeOnComplete: 10,
        removeOnFail: 10,
      }
    );

    this.logger.log(`Scheduled one-time job for scheduler ${schedulerId} at ${scheduledAt.toISOString()}`);
    return job.id!;
  }

  async scheduleCronJob(schedulerId: string, userAddress: string, cronExpression: string): Promise<string> {
    const job = await this.cronQueue.add(
      `cron-${schedulerId}`,
      { schedulerId, userAddress, cronExpression },
      {
        repeat: { pattern: cronExpression },
        removeOnComplete: 5,
        removeOnFail: 5,
      }
    );

    // Store the job info for potential cancellation
    this.activeCronJobs.set(schedulerId, {
      jobId: job.id!,
      repeatJobKey: job.repeatJobKey,
    });

    this.logger.log(`Scheduled cron job for scheduler ${schedulerId} with pattern: ${cronExpression}`);
    return job.id!;
  }

  async cancelScheduledJob(schedulerId: string): Promise<boolean> {
    try {
      // Try to remove from scheduled queue
      const scheduledJobs = await this.scheduledQueue.getJobs(['waiting', 'delayed']);
      for (const job of scheduledJobs) {
        if (job.data.schedulerId === schedulerId) {
          await job.remove();
          this.logger.log(`Cancelled scheduled job for scheduler ${schedulerId}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to cancel scheduled job for scheduler ${schedulerId}:`, error);
      return false;
    }
  }

  async stopCronJob(schedulerId: string): Promise<boolean> {
    try {
      const cronJobInfo = this.activeCronJobs.get(schedulerId);
      if (!cronJobInfo) {
        return false;
      }

      // Remove the repeatable job
      if (cronJobInfo.repeatJobKey) {
        await this.cronQueue.removeRepeatableByKey(cronJobInfo.repeatJobKey);
      }

      // Remove from our tracking
      this.activeCronJobs.delete(schedulerId);

      this.logger.log(`Stopped cron job for scheduler ${schedulerId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to stop cron job for scheduler ${schedulerId}:`, error);
      return false;
    }
  }

  async getJobStatus(schedulerId: string): Promise<{ scheduled?: string; cron?: string } | null> {
    try {
      const result: { scheduled?: string; cron?: string } = {};

      // Check scheduled jobs
      const scheduledJobs = await this.scheduledQueue.getJobs(['waiting', 'delayed', 'active']);
      const scheduledJob = scheduledJobs.find(job => job.data.schedulerId === schedulerId);
      if (scheduledJob) {
        result.scheduled = await scheduledJob.getState();
      }

      // Check cron jobs
      const cronJobInfo = this.activeCronJobs.get(schedulerId);
      if (cronJobInfo) {
        result.cron = 'active';
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      this.logger.error(`Failed to get job status for scheduler ${schedulerId}:`, error);
      return null;
    }
  }

  async onModuleDestroy() {
    await this.scheduledWorker?.close();
    await this.cronWorker?.close();
    await this.scheduledQueue?.close();
    await this.cronQueue?.close();
    await this.scheduledQueueEvents?.close();
    await this.cronQueueEvents?.close();
    
    this.logger.log('Scheduler service destroyed');
  }
}