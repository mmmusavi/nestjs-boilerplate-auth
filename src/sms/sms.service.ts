import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const MelipayamakApi = require("melipayamak");

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  createSMS() {
    const api = new MelipayamakApi(
      this.configService.get<string>("MELIPAYAMAK_USER"),
      this.configService.get<string>("MELIPAYAMAK_PASS")
    );
    const sms = api.sms();

    return sms;
  }

  loginSMS({ phoneNumber, randNumber }) {
    const sms = this.createSMS();
    sms.sendByBaseNumber(
      randNumber,
      phoneNumber,
      this.configService.get<string>("MELIPAYAMAK_LOGINCODE")
    );
  }
}
