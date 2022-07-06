import {
  Controller,
  Get,
  Res,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async generate(
    @Query()
    query: {
      title: string;
    },

    @Res()
    res: Response,
  ) {
    if (!query)
      throw new HttpException('parameter is missing', HttpStatus.BAD_REQUEST);
    try {
      res.send(await this.appService.generate(query.title));
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
