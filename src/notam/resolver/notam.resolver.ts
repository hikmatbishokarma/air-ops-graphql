import { Resolver } from "@nestjs/graphql";
import { NotamService } from "../services/notam.service";

@Resolver()
export class NotamResolver {
    constructor(private readonly service: NotamService) { }
}