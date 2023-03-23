import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from 'libs/entities/src';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagReposityory: Repository<TagEntity>,
    ) {}

    async findAll(): Promise<TagEntity[]> {
        return await this.tagReposityory.find();
    }
}
