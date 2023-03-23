import {
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, FollowsEntity, UserEntity } from 'libs/entities/src';
import { Repository, DeleteResult } from 'typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import {
    IArticleResponse,
    IArticlesResponse,
    IFeedQuery,
    IQuery,
} from './types';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowsEntity)
        private readonly followRepository: Repository<FollowsEntity>,
    ) {}

    async findAll(userId: number, query: IQuery): Promise<IArticlesResponse> {
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        const articlesCount = await queryBuilder.getCount();
        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}%`,
            });
        }
        if (query.author) {
            const author = await this.userRepository.findOne({
                where: {
                    username: query.author,
                },
            });

            if (!author) {
                throw new HttpException(
                    'User with this username is not found',
                    HttpStatus.UNPROCESSABLE_ENTITY,
                );
            }
            queryBuilder.andWhere('articles.authorId = :id', {
                id: author.id,
            });
        }
        console.log(query);
        if (query.favorited) {
            const author = await this.userRepository.findOne({
                where: {
                    username: query.favorited,
                },
                relations: ['favorites'],
            });
            const ids = author.favorites.map((el) => el.id);
            queryBuilder.whereInIds(ids);
        }

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        let favoriteIds: number[] = [];
        if (userId) {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ['favorites'],
            });

            favoriteIds = user.favorites.map((favortie) => favortie.id);
        }

        const articles = await queryBuilder.getMany();
        const articlesWithFavortie = articles.map((article) => {
            const favorited = favoriteIds.includes(article.id);
            return { ...article, favorited };
        });
        return { articles: articlesWithFavortie, articlesCount };
    }

    async getFeed(
        userId: number,
        query: IFeedQuery,
    ): Promise<IArticlesResponse> {
        const follows = await this.followRepository.find({
            where: {
                followerId: userId,
            },
        });

        if (follows.length === 0) {
            return { articles: [], articlesCount: 0 };
        }
        const followingUserIds = follows.map((follow) => follow.followingId);

        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

        console.log(queryBuilder);
        const articlesCount = await queryBuilder.getCount();
        console.log(followingUserIds);

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();

        return { articles, articlesCount };
    }

    async createArticle(
        user: UserEntity,
        createArticleDto: CreateArticleDto,
    ): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);

        if (!article.tagList) {
            article.tagList = [];
        }

        article.slug = this.getSlug(createArticleDto.title);

        article.author = user;

        return await this.articleRepository.save(article);
    }

    async getArticleBySlug(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({
            where: {
                slug,
            },
        });

        if (!article) {
            throw new HttpException(
                'Article with this slug is not found',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        return article;
    }

    async addArticleToFavorites(
        userId: number,
        slug: string,
    ): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['favorites'],
        });

        const isNotFavorited =
            user.favorites.findIndex(
                (articleIndexFavorites) =>
                    articleIndexFavorites.id === article.id,
            ) === -1;

        if (isNotFavorited) {
            user.favorites.push(article);
            article.favoritesCount += 1;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    async deleteArticleFromFavorites(
        userId: number,
        slug: string,
    ): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['favorites'],
        });

        const articleIndex = user.favorites.findIndex(
            (articleIndexFavorites) => articleIndexFavorites.id === article.id,
        );

        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }
    async deleteArticle(userId: number, slug: string): Promise<DeleteResult> {
        const article = await this.getArticleBySlug(slug);

        if (article.author.id != userId) {
            throw new ForbiddenException('Only author can delete this article');
        }

        return await this.articleRepository.delete({ slug });
    }

    async updateArticle(
        userId: number,
        slug: string,
        updateArticleDto: UpdateArticleDto,
    ): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);

        if (article.author.id != userId) {
            throw new ForbiddenException('Only author can delete this article');
        }

        if (!updateArticleDto) {
            throw new HttpException(
                "You didn't send any data to change",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (updateArticleDto.title) {
            const slug = this.getSlug(updateArticleDto.title);

            const titledObject = {
                slug,
                ...updateArticleDto,
            };

            Object.assign(article, titledObject);

            return await this.articleRepository.save(article);
        }

        Object.assign(article, updateArticleDto);

        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): IArticleResponse {
        return { article };
    }

    private getSlug(title: string): string {
        return (
            slugify(title, { lower: true }) +
            '-' +
            ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
        );
    }
}
