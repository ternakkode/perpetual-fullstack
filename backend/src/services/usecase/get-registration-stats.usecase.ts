import { Injectable } from '@nestjs/common';
import { BetaRegistrationRepository } from '@/persistance/repositories/beta-registration.repository';
import { BetaCommunityRepository } from '@/persistance/repositories/beta-community.repository';
import { RegistrationStatsDto, CommunityStatsDto } from '@/dtos/beta-registration.dto';


@Injectable()
export class GetRegistrationStatsUseCase {
  constructor(
    private readonly betaRegistrationRepository: BetaRegistrationRepository,
    private readonly betaCommunityRepository: BetaCommunityRepository,
  ) {}

  async getOverallStats(): Promise<RegistrationStatsDto> {
    const stats = await this.betaRegistrationRepository.getRegistrationStats();

    return {
      totalRegistrations: stats.totalRegistrations,
      publicRegistrations: stats.publicRegistrations,
      communityRegistrations: stats.communityRegistrations,
    };
  }

  async getCommunityStats(communityCode: string): Promise<CommunityStatsDto | null> {
    const community = await this.betaCommunityRepository.findByCommunityCode(communityCode);
    
    if (!community) {
      return null;
    }

    const registrationCount = await this.betaRegistrationRepository.countByCommunityCode(
      communityCode
    );

    return {
      communityCode: community.communityCode,
      name: community.name,
      registrationCount,
      registrationLimit: community.registrationLimit,
      isActive: community.isActive,
    };
  }
}