import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const caPath = path.join(process.cwd(), 'src', 'certs', 'global-bundle.pem');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {
        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl:{
    ca: readFileSync(caPath).toString(),
    rejectUnauthorized: true,
        } });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}