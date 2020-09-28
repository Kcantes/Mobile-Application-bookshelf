import { Injectable } from '@nestjs/common';
import { Book, BookDocument, BookSchema } from './Book'
import { Request, Response } from "express";
import { DocumentQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
  private bookshelf: Book[] = []
  constructor(@InjectModel(BookDocument.name) private BookModel: Model<BookDocument>) { }

  async addBook(book: Book) {
    this.BookModel.find(book).exec()
      .then(
        res => {
          if (res.length == 0)
            this.BookModel.create(book);
        }
      )
  }

  async getBook(name: string): Promise<Book> {
    let book = this.BookModel.findOne({ 'title': name }).exec();
    return book;
  }

  async searchBook(term: string, pagination: Pagination): Promise<Book[]> {
    let req = this.BookModel.find({ $or: [{ title: { $regex: term, $options: 'i' } }, { author: { $regex: term, $options: 'i' } }], }).exec();
    pagination.total_res = (await req).length;
    let books = pagination.getArrayOfPage(this.BookModel.find({ $or: [{ title: { $regex: term, $options: 'i' } }, { author: { $regex: term, $options: 'i' } }], })).exec();
    return books;
  }

  async getBooksOf(author: string, pagination: Pagination) {
    let req = this.BookModel.find({ "author": author }).exec();
    pagination.total_res = (await req).length;
    let books = pagination.getArrayOfPage(this.BookModel.find({ "author": author })).exec();
    return books;
  }

  async getAllBooks(pagination: Pagination): Promise<BookDocument[]> {
    let req = this.BookModel.find().exec();
    pagination.total_res = (await req).length;
    let books = pagination.getArrayOfPage(this.BookModel.find()).exec();
    return books;
  }

  BookstoString(books: Book[]): string {
    let a: string = "";
    for (let index = 0; index < books.length; index++) {
      const element = books[index];
      a += element.title;
    }
    return a;
  }

  async getTotalNumberOfBooks() {
    return (await this.BookModel.find().exec()).length;
  }

  async deleteBook(name: string) {
    this.getBook(name).then(res => {
      if (res != undefined && res != null) {
        this.BookModel.deleteOne({ 'title': name }).exec();
      }
    }
    )
  }
  fizzbuzz(n: number) {
    return (((n % 15 == 0)) && "fizzbuzz") || (((n % 3 == 0)) && "fizz") || (((n % 5 == 0)) && "buzz")
  }
}


export class Pagination {
  page: number = 1;
  recordsPerPage: number = 15;
  total_res: number = 0;
  constructor(page: number, records_per_page: number) {
    this.page = page;
    this.recordsPerPage = records_per_page;
  }
  public reset() {
    this.page = 1;
    this.recordsPerPage = 15;
    this.total_res = 0;
  }
  public getArrayOfPage(content: any) {
    content.skip(this.recordsPerPage * (this.page - 1))
    content.limit(this.recordsPerPage);
    return content;
  }
}
