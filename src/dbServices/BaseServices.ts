import {PrismaClient} from "@prisma/client";

export abstract class BaseServices {
    protected prisma: PrismaClient;
    protected constructor() {
        this.prisma = new PrismaClient();
    }
}