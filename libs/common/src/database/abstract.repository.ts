import { Logger, NotFoundException } from "@nestjs/common";
import {FilterQuery, Model,Types, UpdateQuery} from 'mongoose';
import { AbstractDocumnet } from "./abstract.schema"; 

export abstract class AbstractRepository<TDocumnet extends AbstractDocumnet>{
    protected abstract readonly logger:Logger;
    constructor(protected readonly model:Model<TDocumnet>){}

    async creat(documnet :Omit<TDocumnet,'_id'>):Promise<TDocumnet>{
        const createdDocument= new this.model({
            ...documnet,
            _id:new Types.ObjectId(),
        })
        return (await createdDocument.save()).toJSON() as unknown as TDocumnet;
    }

    async findOne(filterQuery:FilterQuery<TDocumnet>):Promise<TDocumnet>{
        const documnet = await this.model.findOne(filterQuery)
        .lean<TDocumnet>(true);
        if(!documnet){
            this.logger.warn('Document was not found with filter Query',filterQuery)
            throw new NotFoundException('Document Waw Not Found')
        }
        return documnet;
    }
    async findOneAndUpdate(
        filterQuery:FilterQuery<TDocumnet>,
        update:UpdateQuery<TDocumnet>,
    ):Promis<TDocumnet>{
        const documne= await this.model
        .findOneAndUpdate(filterQuery,update,{
            new:true
        })
        .lean<TDocumnet>(true);

        if(!documnet){
            this.logger.warn('Document was not found with filter Query',filterQuery)
            throw new NotFoundException('Document Waw Not Found')
        }
        return documnet;
    }
    async find(filterQuery:FilterQuery<TDocumnet>):Promis<TDocumnet[]>{
        return this.model.find(filterQuery).lean(TDocument[])(true);
    }
    async findOneAndDelete(
        filterQuery: FilterQuery<TDocumnet>,

    ):Promis<TDocumnet>{
        return this.model.findOneAndDelete(filterQuery).lean<TDocumnet>(true);
    }
}