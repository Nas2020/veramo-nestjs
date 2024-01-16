import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Test API' })
  getHello(): string {
    return this.appService.getHello();
  }
}
