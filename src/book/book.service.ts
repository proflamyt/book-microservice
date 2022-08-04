import { HttpException,  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { catchError, map } from 'rxjs';
import { Books } from './interfaces/book.interface';
import { Character } from './interfaces/character.interfaces';

@Injectable()
export class BookService {
    constructor(private readonly http: HttpService) {}

    // listing the names of books along with their authors and comment count,

    async listBooks() {

        return this.callUrl("https://anapioficeandfire.com/api/books")
            .pipe(
                // sorting from earliest to latest
                map((data)=> data.sort((a,b) => Number(a.released) - Number(b.released))),
                map((data) => {
                    return data.map(this.mapBooks);
                  }),
                  catchError((e) => {
                    throw new HttpException(e.response.data, e.response.status);
                }),
            )
    }

    async listCharacter(data: { id: any; }) {
        return this.callUrl(`https://anapioficeandfire.com/api/books/${data.id}`)
            .pipe(
                map(
                    (data) => {
                        return this.mapCharacters(data);
                    }
                ),
                catchError((e) => {
                  throw new HttpException(e.response.data, e.response.status);
              }),
            )

    }

    private callUrl(url: string) {
        return this.http.get(url)
            .pipe(
            map((response) =>  response.data),
            catchError((e) => {
                throw new HttpException(e.response.data, e.response.status);
            }),
            );
        
        
      }

    private mapBooks(data: { name: string; authors: []; }): Books {
        // fetch numbers of comment
        let count = this.fetchCommentNum(data.name)
        return {
            name : data.name,
            authors : data.authors,
            count : count
        }
        
    }
    private fetchCommentNum(name: string) {
        return 1
    }

    private mapCharacters(data): Character {
        return {
            character : data.characters
        }
    }

      
}
