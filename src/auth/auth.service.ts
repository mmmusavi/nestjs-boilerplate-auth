import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas";
import { SmsService } from "src/sms/sms.service";
import { UtilsService } from "src/utils/utils.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly utilsService: UtilsService,
    private readonly smsService: SmsService,
    private jwt: JwtService,
    private configService: ConfigService
  ) {}

  async sendOtp(phoneNumber: string) {
    const englishPhoneNumber =
      this.utilsService.convertToEnglishNumerals(phoneNumber);

    if (!englishPhoneNumber.startsWith("09")) {
      return { status: 400, message: "شماره همراه باید با 09 شروع شود" };
    }

    const now = Math.floor(Date.now() / 1000);
    const otp = this.utilsService.generateSMSNumber();
    const user = await this.userModel.findOne({
      phone: englishPhoneNumber,
    });

    if (user) {
      const timeDifference = now - Math.floor(user.smsOtpTime);

      if (timeDifference <= 120) {
        const remainingTime = 120 - timeDifference;

        return {
          status: 404,
          message: "try again",
          remainingTime,
        };
      }

      user.smsOtpTime = now;
      user.smsOtp = otp;
      await user.save();

      this.smsService.loginSMS({
        phoneNumber: englishPhoneNumber,
        randNumber: user.smsOtp,
      });

      return {
        status: 200,
        message: "Otp sent successfully",
      };
    }

    await this.userModel.create({
      phone: englishPhoneNumber,
      smsOtp: otp,
      smsOtpTime: now,
    });

    this.smsService.loginSMS({
      phoneNumber: englishPhoneNumber,
      randNumber: otp,
    });

    return {
      status: 200,
      message: "Otp sent successfully",
    };
  }

  async changePass({ phoneNumber, otp, pass }) {
    const englishPhoneNumber =
      this.utilsService.convertToEnglishNumerals(phoneNumber);

    const user = await this.userModel.findOne({
      phone: englishPhoneNumber,
      smsOtp: otp,
    });

    if (user) {
      const now = Math.floor(Date.now() / 1000);
      const timeDifference = now - Math.floor(user.smsOtpTime);

      if (timeDifference > 600) {
        return {
          status: 404,
          message: "otp expired",
        };
      }

      const hash = await argon.hash(pass);

      user.smsOtp = this.utilsService.generateSMSNumber();
      user.password = hash;
      await user.save();

      const access_token = await this.signToken(englishPhoneNumber);

      return {
        status: 200,
        message: "Change password successful",
        access_token,
      };
    }

    return {
      status: 404,
      message: "Credentials error",
    };
  }

  async loginWithOtp({ phoneNumber, otp }) {
    const englishPhoneNumber =
      this.utilsService.convertToEnglishNumerals(phoneNumber);

    const user = await this.userModel.findOne({
      phone: englishPhoneNumber,
      smsOtp: otp,
    });

    if (user) {
      const now = Math.floor(Date.now() / 1000);
      const timeDifference = now - Math.floor(user.smsOtpTime);

      if (timeDifference > 600) {
        return {
          status: 404,
          message: "otp expired",
        };
      }

      const access_token = await this.signToken(englishPhoneNumber);

      user.smsOtp = this.utilsService.generateSMSNumber();
      await user.save();

      return {
        status: 200,
        message: "Login successful",
        access_token,
      };
    }

    return {
      status: 404,
      message: "Credentials error",
    };
  }

  async loginWithPass({ phoneNumber, pass }) {
    const englishPhoneNumber =
      this.utilsService.convertToEnglishNumerals(phoneNumber);

    const user = await this.userModel.findOne({
      phone: englishPhoneNumber,
    });

    if (user && (await argon.verify(user.password, pass))) {
      const access_token = await this.signToken(englishPhoneNumber);

      return {
        status: 200,
        message: "Login successful",
        access_token,
      };
    }

    return {
      status: 404,
      message: "Credentials error",
    };
  }

  async signToken(phone) {
    const payload = {
      phone,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: "7d",
      secret: this.configService.get("JWT_SECRET"),
    });

    return access_token;
  }
}
