import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService, ScheduledJobData, CronJobData } from './scheduler.service';
import { ScheduledExecutorUseCase } from './usecase/scheduled-executor.usecase';
import { CronExecutionUseCase } from './usecase/cron-execution.usecase';

@Injectable()
export class SchedulerManagerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerManagerService.name);

  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly scheduledExecutorUseCase: ScheduledExecutorUseCase,
    private readonly cronExecutionUsecase: CronExecutionUseCase,
  ) {}

  async onModuleInit() {
    // Set up the workers to process scheduled and cron jobs
    this.schedulerService.setWorkers(
      this.processScheduledJob.bind(this),
      this.processCronJob.bind(this)
    );

    this.logger.log('Scheduler manager initialized with job processors');
  }

  private async processScheduledJob(job: { data: ScheduledJobData }) {
    await this.scheduledExecutorUseCase.execute(job.data);
  }

  private async processCronJob(job: { data: CronJobData }) {
    await this.cronExecutionUsecase.execute(job.data);
  }
}