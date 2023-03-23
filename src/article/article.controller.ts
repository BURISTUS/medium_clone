import { GetUser } from '@app/user/decorator';
import { FindAllGuard, JwtGuard } from '@app/user/guard';
import {
    Body,
    Controller,
    Param,
    Post,
    UseGuards,
    Get,
    Put,
    Delete,
    Query,
} from '@nestjs/common';
import { UserEntity } from 'libs/entities/src';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import {
    IArticleResponse,
    IArticlesResponse,
    IFeedQuery,
    IQuery,
} from './types';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    @UseGuards(FindAllGuard)
    async findAll(
        @GetUser('id') userId: number,
        @Query() query: IQuery,
    ): Promise<IArticlesResponse> {
        return await this.articleService.findAll(userId, query);
    }

    @Get('feed')
    @UseGuards(JwtGuard)
    async getFeed(
        @GetUser('id') userId: number,
        @Query() query: IFeedQuery,
    ): Promise<IArticlesResponse> {
        return await this.articleService.getFeed(userId, query);
    }

    @Post()
    @UseGuards(JwtGuard)
    async createArticle(
        @GetUser() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto,
    ): Promise<IArticleResponse> {
        const article = await this.articleService.createArticle(
            currentUser,
            createArticleDto,
        );

        return this.articleService.buildArticleResponse(article);
    }

    @Get(':slug')
    async getArticleBySlug(
        @Param('slug') slug: string,
    ): Promise<IArticleResponse> {
        const article = await this.articleService.getArticleBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Put(':slug')
    @UseGuards(JwtGuard)
    async updateArticle(
        @GetUser('id') userId: number,
        @Param('slug') slug: string,
        @Body('article') updateArticleDto: UpdateArticleDto,
    ): Promise<IArticleResponse> {
        const article = await this.articleService.updateArticle(
            userId,
            slug,
            updateArticleDto,
        );
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(JwtGuard)
    async deleteArticle(
        @GetUser('id') userId: number,
        @Param('slug') slug: string,
    ): Promise<DeleteResult> {
        return await this.articleService.deleteArticle(userId, slug);
    }

    @Post(':slug/favorite')
    @UseGuards(JwtGuard)
    async addArticleToFavorites(
        @GetUser('id') userId: number,
        @Param('slug') slug: string,
    ): Promise<IArticleResponse> {
        const article = await this.articleService.addArticleToFavorites(
            userId,
            slug,
        );

        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(JwtGuard)
    async deleteArticleFromFavorites(
        @GetUser('id') userId: number,
        @Param('slug') slug: string,
    ): Promise<IArticleResponse> {
        const article = await this.articleService.deleteArticleFromFavorites(
            userId,
            slug,
        );

        return this.articleService.buildArticleResponse(article);
    }
}
