import { ArticleEntity } from 'libs/entities/src';

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>;
