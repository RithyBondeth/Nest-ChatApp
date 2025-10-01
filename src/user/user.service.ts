import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    async findAllUser() {
        return "All Users";
    }
}
