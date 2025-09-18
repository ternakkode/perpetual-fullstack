import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BetaRegistration, RegistrationType } from '@/entities/beta-registration.entity';
import { BetaRegistrationRepository } from '@/persistance/repositories/beta-registration.repository';
import { CreatePublicRegistrationDto } from '@/dtos/beta-registration.dto';

@Injectable()
export class CreatePublicRegistrationUseCase {
  constructor(
    private readonly betaRegistrationRepository: BetaRegistrationRepository,
  ) {}

  async execute(dto: CreatePublicRegistrationDto): Promise<BetaRegistration> {
    // Check if wallet is already registered
    const existingRegistration = await this.betaRegistrationRepository.findByWalletAddress(
      dto.walletAddress
    );

    if (existingRegistration) {
      throw new ConflictException('Wallet address is already registered');
    }

    // Check public registration limit (no limit as per requirements)
    // But we still track the count for display purposes
    const publicCount = await this.betaRegistrationRepository.countByRegistrationType(
      RegistrationType.PUBLIC
    );

    // Create new registration
    const registration = new BetaRegistration();
    registration.id = `reg_${uuidv4().replace(/-/g, '')}`;
    registration.walletAddress = dto.walletAddress.toLowerCase();
    registration.registrationType = RegistrationType.PUBLIC;
    registration.twitterHandle = dto.twitterHandle;
    registration.tweetUrl = dto.tweetUrl;

    return await this.betaRegistrationRepository.save(registration);
  }

  async getPublicRegistrationCount(): Promise<number> {
    return await this.betaRegistrationRepository.countByRegistrationType(
      RegistrationType.PUBLIC
    );
  }
}