import { AuthGuard } from '@nestjs/passport';

export class FindAllGuard extends AuthGuard('findAll') {
    constructor() {
        super();
    }
}
