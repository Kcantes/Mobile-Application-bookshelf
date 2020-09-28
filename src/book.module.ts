import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService, Pagination } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookDocument, BookSchema } from 'Book';

@Module({
  imports: [MongooseModule.forRoot('mongodb://uht3sohis1mldn19adwf:IPX5vK92lnO71nHeJriF@bqxuj1qtyo7iqvb-mongodb.services.clever-cloud.com:27017/bqxuj1qtyo7iqvb'),MongooseModule.forFeature([{ name: BookDocument.name, schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService, Pagination],
})
export class BookModule {}
