import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
    constructor( private bookService: BookService){}

    @MessagePattern({ cmd: "get_books" })
    listBooks() {
        return this.bookService.listBooks();
    }

    // getting the character list for a book.
    @MessagePattern({ cmd: "get_characters" })
    listCharacter(data) {
        return this.bookService.listCharacter(data);

    }
    
}
