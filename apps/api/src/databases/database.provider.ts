// import { Inject } from '@nestjs/common';
// import { DatabaseConfig } from 'src/common/config/database.config';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '../../generated/prisma/client';
// import { TransactionHost } from '@nestjs-cls/transactional';
// import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

// export const DB_PROVIDER = 'DB_PROVIDER';
// export const InjectDb = () => Inject(DB_PROVIDER);

// export const dbProvider = {
//   provide: DB_PROVIDER,
//   inject: [DatabaseConfig],
//   useFactory: (databaseConfig: DatabaseConfig) => {
//     const adapter = new PrismaPg({ connectionString: databaseConfig.url });
//     const prisma = new PrismaClient({ adapter });
//     return prisma;
//   },
// };
