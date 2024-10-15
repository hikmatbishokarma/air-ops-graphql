import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[UsersModule,
        JwtModule.register({
            global: true,
            secret: "1234",//TODO: Do not expose this key publicly. 
            signOptions: { expiresIn: '3600s' },
          }),
    ],
    providers:[AuthService],
    controllers:[AuthController]
})
export class AuthModule{}