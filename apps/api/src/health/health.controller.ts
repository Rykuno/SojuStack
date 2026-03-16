import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck, type HealthIndicatorResult } from '@nestjs/terminus';
import { DRIZZLE_PROVIDER, DrizzleProvider } from 'src/database/drizzle.provider';
import { S3Service } from 'src/storage/s3.service';
import { StorageBucket } from 'src/storage/storage.constants';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: ReturnType<typeof DrizzleProvider.useFactory>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.checkCache(),
      () => this.checkStorage(),
    ]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    await this.db.$client.query('select 1');
    return { database: { status: 'up' } };
  }

  private async checkCache(): Promise<HealthIndicatorResult> {
    const key = `health:${Date.now()}`;

    await this.cache.set(key, 'ok', 1000);
    const value = await this.cache.get<string>(key);
    await this.cache.del(key);

    if (value !== 'ok') {
      throw new Error('Cache roundtrip failed');
    }

    return { cache: { status: 'up' } };
  }

  private async checkStorage(): Promise<HealthIndicatorResult> {
    const bucketExists = await this.s3Service.bucketExists(StorageBucket.Public);

    if (!bucketExists) {
      throw new Error(`Bucket "${StorageBucket.Public}" does not exist`);
    }

    return { storage: { status: 'up' } };
  }
}
