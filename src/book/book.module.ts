import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
