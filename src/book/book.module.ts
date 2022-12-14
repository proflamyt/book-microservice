import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),
  ClientsModule.register([
    {
      name: 'COMMENTS_SERVICE',
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 8888
      }
    },])
],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
