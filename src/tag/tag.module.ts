import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'libs/entities/src';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    controllers: [TagController],
    providers: [TagService],
})
export class TagModule {}
