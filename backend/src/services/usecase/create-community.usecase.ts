import { Injectable, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BetaCommunity } from '@/entities/beta-community.entity';
import { BetaCommunityRepository } from '@/persistance/repositories/beta-community.repository';
import { CreateCommunityDto } from '@/dtos/beta-registration.dto';

@Injectable()
export class CreateCommunityUseCase {
  constructor(
    private readonly betaCommunityRepository: BetaCommunityRepository,
  ) {}

  async execute(dto: CreateCommunityDto): Promise<BetaCommunity> {
    // Check if community code already exists
    const existingCommunity = await this.betaCommunityRepository.findByCommunityCode(
      dto.communityCode
    );

    if (existingCommunity) {
      throw new ConflictException('Community code already exists');
    }

    // Create new community
    const community = new BetaCommunity();
    community.id = `com_${uuidv4().replace(/-/g, '')}`;
    community.communityCode = dto.communityCode.toUpperCase();
    community.name = dto.name;
    community.description = dto.description;
    community.registrationLimit = dto.registrationLimit || 1000;
    community.isActive = true;

    return await this.betaCommunityRepository.save(community);
  }
}