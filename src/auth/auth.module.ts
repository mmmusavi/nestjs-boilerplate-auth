import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas";
import { UtilsModule } from "src/utils/utils.module";
import { SmsModule } from "src/sms/sms.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UtilsModule,
    SmsModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
