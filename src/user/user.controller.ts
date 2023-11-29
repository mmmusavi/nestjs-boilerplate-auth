import { Controller, Get, Res, UseGuards, Req } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/jwt.guard";

@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(private UserService: UserService) {}

  @Get("me")
  async me(@Req() req, @Res() res: Response) {
    const meResult = await this.UserService.me(req.user.phone);

    res.status(meResult.status).json(meResult);
  }
}
