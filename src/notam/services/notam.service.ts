import { MongooseQueryService } from "@app/query-mongoose";
import { Injectable } from "@nestjs/common";
import { NotamEntity } from "../entities/notam.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class NotamService extends MongooseQueryService<NotamEntity> {

    constructor(@InjectModel(NotamEntity.name)
    private readonly model: Model<NotamEntity>,) {
        super(model);
    }
}