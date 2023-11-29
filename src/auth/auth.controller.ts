import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import {
  PhoneNumberDto,
  ChangePassDto,
  PhoneNumberOtpDto,
  PhoneNumberPassDto,
} from "src/dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post("sendOtp")
  async sendOtp(@Body() body: PhoneNumberDto, @Res() res: Response) {
    const { phoneNumber } = body;

    const sendOtpResult = await this.AuthService.sendOtp(phoneNumber);

    res.status(sendOtpResult.status).json(sendOtpResult);
  }

  @Post("changePass")
  async changePass(@Body() body: ChangePassDto, @Res() res: Response) {
    const { phoneNumber, otp, pass } = body;

    const changePassResult = await this.AuthService.changePass({
      phoneNumber,
      otp,
      pass,
    });

    res.status(changePassResult.status).json(changePassResult);
  }

  @Post("loginWithOtp")
  async loginWithOtp(@Body() body: PhoneNumberOtpDto, @Res() res: Response) {
    const { phoneNumber, otp } = body;

    const loginWithOtpResult = await this.AuthService.loginWithOtp({
      phoneNumber,
      otp,
    });

    res.status(loginWithOtpResult.status).json(loginWithOtpResult);
  }

  @Post("loginWithPass")
  async loginWithPass(@Body() body: PhoneNumberPassDto, @Res() res: Response) {
    const { phoneNumber, pass } = body;

    const loginWithPassResult = await this.AuthService.loginWithPass({
      phoneNumber,
      pass,
    });

    res.status(loginWithPassResult.status).json(loginWithPassResult);
  }
}
