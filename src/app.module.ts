import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TransferModule } from './transfer/transfer.module';
import { RulesModule } from './rules/rules.module';
import * as ormconfig from './ormconfig';

export function DatabaseOrmModule(): DynamicModule {
  // https://github.com/ambroiseRabier/typeorm-nestjs-migration-example
  // https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#using-migration-api-to-write-migrations
  return TypeOrmModule.forRoot(ormconfig);
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'assets/db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'migration',
      },
      synchronize: true,
    }),
    CategoryModule,
    TransferModule,
    RulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
  }
}
