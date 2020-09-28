import * as mongoose from "mongoose";
import { MongoClient, Db } from "mongodb";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Book{
  title: string;
  author: string;
  date: string | Date;
}

@Schema({ collection: 'Theophile' })
export class BookDocument extends Document {
  @Prop()
  title: string;
  @Prop()
  author: string;
  @Prop()
  date: string | Date;
}

export const BookSchema = SchemaFactory.createForClass(BookDocument);

