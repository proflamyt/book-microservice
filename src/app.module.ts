import { Module } from '@nestjs/common';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [BookModule, HttpModule],
  providers: [BookService],
 
})
export class AppModule {}
