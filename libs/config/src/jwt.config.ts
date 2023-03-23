import * as config from 'config';
import { IJwtConfig } from './interfaces';

export const JWT_CONFIG: IJwtConfig = config.get<IJwtConfig>('jwt');
