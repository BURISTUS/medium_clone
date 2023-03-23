import { IsOptional } from 'class-validator';

export class EditUserDto {
    @IsOptional()
    email?: string;

    @IsOptional()
    username?: string;

    @IsOptional()
    bio?: string;

    @IsOptional()
    image?: string;
}
