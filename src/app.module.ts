import { Module } from '@nestjs/common';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [BookModule, HttpModule,
    ClientsModule.register([
      {
        name: 'COMMENTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 8888
        }
      },])],
  providers: [BookService],
 
})
export class AppModule {}
