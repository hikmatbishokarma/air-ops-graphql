import { Injectable } from "@nestjs/common";
import { UserDTO } from "../dto/users.dto";

@Injectable()
export class UsersService {
    constructor(){}

    private readonly users = [
        {
          id: 1,
          name: 'john',
          password: 'changeme',
        },
        {
          id: 2,
          name: 'maria',
          password: 'guess',
        },
      ];

      async findOne(username: string): Promise<UserDTO | undefined> {
        return this.users.find(user => user.name === username);
      }
}