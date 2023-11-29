import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async me(phone) {
    return {
      status: 200,
      message: "Logged in",
      phone,
    };
  }
}
