import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateUnifiedExecutionUseCase } from '@/services/usecase/create-unified-execution.usecase';
import { GetUnifiedExecutionsUseCase } from '@/services/usecase/get-unified-executions.usecase';
import { CancelUnifiedExecutionUseCase } from '@/services/usecase/cancel-unified-execution.usecase';
import { 
  CreateUnifiedExecutionRequest, 
  CreateUnifiedExecutionResponse,
  GetUnifiedExecutionsRequest,
  GetUnifiedExecutionsResponse,
  CancelUnifiedExecutionResponse 
} from '@/dtos/execution.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';

export interface GetExecutionsQueryDto {
  limit?: number;
  offset?: number;
  triggerType?: 'SCHEDULER' | 'ADVANCE_TRIGGER';
}

@Controller('executions')
export class ExecutionsController {
  constructor(
    private readonly createUnifiedExecutionUseCase: CreateUnifiedExecutionUseCase,
    private readonly getUnifiedExecutionsUseCase: GetUnifiedExecutionsUseCase,
    private readonly cancelUnifiedExecutionUseCase: CancelUnifiedExecutionUseCase,
  ) {}

  /**
   * Create a complete execution with trading order + trigger in single API call
   * This replaces the old POST /executors endpoint with better structure
   */
  @Post()
  async createUnifiedExecution(
    @Body() request: CreateUnifiedExecutionRequest,
    @CurrentUser('address') userAddress: string,
  ): Promise<CreateUnifiedExecutionResponse> {
    return this.createUnifiedExecutionUseCase.execute({
      ...request,
      userAddress,
    });
  }

  /**
   * Get all executions with parent-child view (trading order + triggers)
   * This replaces the old GET /executors endpoint with unified view
   */
  @Get()
  async getUnifiedExecutions(
    @Query() query: GetExecutionsQueryDto,
    @CurrentUser('address') userAddress: string,
  ): Promise<GetUnifiedExecutionsResponse> {
    return this.getUnifiedExecutionsUseCase.execute({
      userAddress,
      limit: query.limit,
      offset: query.offset,
      triggerType: query.triggerType,
    });
  }

  /**
   * Cancel complete execution (trading order + all associated triggers)
   * This replaces the old DELETE /executors/:id with unified cancellation
   */
  @Delete(':tradingOrderId')
  async cancelUnifiedExecution(
    @Param('tradingOrderId') tradingOrderId: string,
    @CurrentUser('address') userAddress: string,
  ): Promise<CancelUnifiedExecutionResponse> {
    return this.cancelUnifiedExecutionUseCase.execute({
      tradingOrderId,
      userAddress,
    });
  }
}