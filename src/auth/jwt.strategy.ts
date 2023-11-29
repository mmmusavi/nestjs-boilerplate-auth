import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from "src/schemas";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const user = await this.UserModel.findOne({
      phone: payload.phone,
    });
    return user;
  }
}
