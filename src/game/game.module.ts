import { Module } from '@nestjs/common';
import { GameController } from './infrastructure/controllers/game.controller';
import { GameService } from './application/services/game.service';
// import { GameRepository } from './infrastructure/repositories/game.repository';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';
import { INJECTION_TOKENS } from '../shared/constants/injection-tokens';
import { FirstApiAdapter } from './infrastructure/adapters/first-api.adapter';
import { SecondApiAdapter } from './infrastructure/adapters/second-api.adapter';
import { FederatedGamesAdapter } from './infrastructure/adapters/federated-games.adapter';

@Module({
  controllers: [GameController],
  providers: [
    GameService,
    PrismaService,
    {
      provide: INJECTION_TOKENS.FIRST_API_REPOSITORY,
      useFactory: () => new FirstApiAdapter('https://api1.example.com'),
    },
    {
      provide: INJECTION_TOKENS.SECOND_API_REPOSITORY,
      useFactory: () => new SecondApiAdapter('https://api2.example.com'),
    },
    {
      provide: INJECTION_TOKENS.GAME_REPOSITORY,
      useFactory: (firstApi: FirstApiAdapter, secondApi: SecondApiAdapter) => {
        return new FederatedGamesAdapter([firstApi, secondApi]);
      },
      inject: [
        INJECTION_TOKENS.FIRST_API_REPOSITORY,
        INJECTION_TOKENS.SECOND_API_REPOSITORY,
      ],
    },
  ],
  exports: [GameService],
})
export class GameModule {}
