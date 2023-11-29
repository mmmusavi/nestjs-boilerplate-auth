import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class PhoneNumberDto {
  @IsNotEmpty({ message: "phoneNumber is required" })
  phoneNumber: string;
}

export class ChangePassDto {
  @IsNotEmpty({ message: "phoneNumber is required" })
  phoneNumber: string;

  @IsNotEmpty({ message: "otp is required" })
  otp: number;

  @IsString()
  @MinLength(8, { message: "گذرواژه باید حداقل 8 کاراکتر باشد." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: "گذرواژه باید حداقل شامل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد.",
  })
  pass: string;
}

export class PhoneNumberOtpDto {
  @IsNotEmpty({ message: "phoneNumber is required" })
  phoneNumber: string;

  @IsNotEmpty({ message: "otp is required" })
  otp: number;
}

export class PhoneNumberPassDto {
  @IsNotEmpty({ message: "phoneNumber is required" })
  phoneNumber: string;

  @IsNotEmpty({ message: "pass is required" })
  pass: string;
}
