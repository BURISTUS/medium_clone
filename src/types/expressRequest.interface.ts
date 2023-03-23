import { Request } from 'express';
import { UserEntity } from 'libs/entities/src';

export interface ExpressRequestInterface extends Request {
    user?: UserEntity;
}
