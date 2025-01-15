import {PrismaClient} from "@prisma/client";

export abstract class BaseController {
    protected prisma: PrismaClient;
    protected constructor() {
        this.prisma = new PrismaClient();
    }
}