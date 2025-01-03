import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from '../../application/services/game.service';
import { CreateGameDto } from '../../application/dtos/create-game.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully.' })
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a games' })
  @ApiResponse({ status: 200, description: 'Game found.' })
  async getGames() {
    return this.gameService.getGames();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiResponse({ status: 200, description: 'Game found.' })
  async getGame(@Param('id') id: string) {
    return this.gameService.getGameById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all games for a user' })
  @ApiResponse({ status: 200, description: 'Games found.' })
  async getGamesByUserId(@Param('userId') userId: string) {
    return this.gameService.getGamesByUserId(userId);
  }
}
