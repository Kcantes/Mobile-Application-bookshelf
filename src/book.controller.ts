import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { BookService, Pagination } from './book.service';
import { Book, BookDocument } from './Book';

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService, private pagination: Pagination) {
  }
  @Get('')
  getBooks(@Query() queryElements) {
    if ("page" in queryElements)
      this.pagination.page = queryElements["page"];
    if ("nb_per_page" in queryElements)
      this.pagination.recordsPerPage = Number.parseInt(queryElements["nb_per_page"]);
    if ("author" in queryElements)
      return this.bookService.getBooksOf(decodeURIComponent(queryElements["author"]),this.pagination);
    return this.bookService.getAllBooks(this.pagination).then(
      res => {
        let result = { data: res, page: this.pagination.page, nb_per_page: this.pagination.recordsPerPage }
        return result;
      }
    );
  }
  @Post('')
  postBook(@Body() args) {
    if (!("author" in args && "title" in args && "date" in args))
      return "Not a book posted"
    let book: Book = { author: args["author"], title: args["title"], date: args["date"] };
    this.bookService.addBook(book);
    return book;
  }
  @Get(':book')
  getBook(@Param() book) {
    return this.bookService.getBook(decodeURIComponent(book["book"]));
  }
  @Delete(':book')
  deleteBook(@Param() book) {
    this.bookService.deleteBook(decodeURIComponent(book["book"]))
  }
  @Post(':search')
  search(@Body() term, @Query() queryElements) {
    if ("page" in queryElements)
      this.pagination.page = queryElements["page"];
    if ("nb_per_page" in queryElements)
      this.pagination.recordsPerPage = queryElements["nb_per_page"];
    return this.bookService.searchBook(decodeURIComponent(term["term"]),this.pagination);
  }

}
