import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BetaRegistration, RegistrationType } from '@/entities/beta-registration.entity';
import { BetaRegistrationRepository } from '@/persistance/repositories/beta-registration.repository';
import { BetaCommunityRepository } from '@/persistance/repositories/beta-community.repository';
import { CreateCommunityRegistrationDto } from '@/dtos/beta-registration.dto';

@Injectable()
export class CreateCommunityRegistrationUseCase {
  constructor(
    private readonly betaRegistrationRepository: BetaRegistrationRepository,
    private readonly betaCommunityRepository: BetaCommunityRepository,
  ) {}

  async execute(dto: CreateCommunityRegistrationDto): Promise<BetaRegistration> {
    // Check if community exists and is active
    const community = await this.betaCommunityRepository.findByCommunityCode(
      dto.communityCode
    );

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (!community.isActive) {
      throw new BadRequestException('Community is not active');
    }

    // Check if wallet is already registered
    const existingRegistration = await this.betaRegistrationRepository.findByWalletAddress(
      dto.walletAddress
    );

    if (existingRegistration) {
      throw new ConflictException('Wallet address is already registered');
    }

    // Check community registration limit
    const communityCount = await this.betaRegistrationRepository.countByCommunityCode(
      dto.communityCode
    );

    if (communityCount >= community.registrationLimit) {
      throw new BadRequestException('Community registration limit reached');
    }

    // Create new registration
    const registration = new BetaRegistration();
    registration.id = `reg_${uuidv4().replace(/-/g, '')}`;
    registration.walletAddress = dto.walletAddress.toLowerCase();
    registration.registrationType = RegistrationType.COMMUNITY;
    registration.communityCode = dto.communityCode;

    return await this.betaRegistrationRepository.save(registration);
  }

  async getCommunityRegistrationCount(communityCode: string): Promise<number> {
    return await this.betaRegistrationRepository.countByCommunityCode(communityCode);
  }
}