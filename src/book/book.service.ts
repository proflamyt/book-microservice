import { HttpException,  Inject,  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { catchError, concat, forkJoin, iif, map , Observable, of} from 'rxjs';
import {combineLatest, combineLatestAll, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Books } from './interfaces/book.interface';
import { Character } from './interfaces/character.interfaces';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BookService {
    // private characters: string[] = [];
    constructor( @Inject('COMMENTS_SERVICE') private readonly clientOla: ClientProxy,
        private readonly http: HttpService) {}

    // listing the names of books along with their authors and comment count,
    
    async listBooks() {

        return this.callUrl("https://anapioficeandfire.com/api/books")
            .pipe(
                // sorting from earliest to latest
                map((data)=> data.sort((a,b) => Number(a.released) - Number(b.released))),
                map((data) => {
                    return data.map(this.mapBooks);
                  }),
                map((data)=> {
                    return data.map(this.fetchCommentNum)
                }
                ),
            );
    }

     listCharacter(data: { id: any; }) {
        return this.callUrl(`https://anapioficeandfire.com/api/books/${data.id}`)
            .pipe(
                map(
                    (resp) => { 
                       // this.characters.push(...resp.characters);
                       
                    return resp.characters
                    // [
                    //     url,url
                    // ]
                }),
                map (
                    (data) => {
                        return data.map(url => this.callUrl(url));
                    }),
                
                map(function (data) {
                    var characters = [];
                    
                   data.map(function (item) {
                         item.subscribe(
                            function (ola: any) {
                           return characters.push(ola.name)   
                        }

                        );


                      });
                            
                    return characters;

                      // console.log(this.characters)
                     
                
                }),
                    // return iif(() => data !== null, this.callUrl(data), of(this.characters));
                 
                // tap(data => console.log(data)),
                // map((data) => {

                //    return this.http.get('https://anapioficeandfire.com/api/characters/1303').pipe(
                //         // tap(data => console.log(data)),
                //          map((response) => {
                //           console.log(response)
                //              return response.data
             
                //          } ),
                //          catchError((e) => {
                //              throw new HttpException(e.response.data, e.response.status);
                //          }),
                //          )
                //     //this.characters.forEach(this.callUrl)
                     
                //   }),
                // map((data) => {
                //     return data

                // }),
                // tap(data => console.log(data)),
                
            )

    }

    private callUrl(url: string) {
        // console.log(url)
        return this.http.get(url)
            .pipe(
           // tap(data => console.log(data)),
            map((response) => {
            //    console.log(response)
                return response.data

            })
            );
        
        
      }

    private mapBooks(data: { name: string; authors: []; }): Books {
        // fetch numbers of comment
       
        return {
            name : data.name,
            authors : data.authors,
            
        }
        
    }
    private fetchCommentNum(data) {
        const pattern = {cmd : 'get_numbers_of_comments'};
        const payload = {name: data.name};
        let count = this.clientOla
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message }))
      );
        return {...data, count:count} 
    }

    private mapCharacters(data){
        return {
            name : data.name
        }
    }

      
}
