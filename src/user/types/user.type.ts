import { UserEntity } from 'libs/entities/src';

export type UserType = Omit<UserEntity, 'hashPassword'>;
