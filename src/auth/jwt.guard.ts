import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }
}
