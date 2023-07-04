import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export default class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string | undefined;

  @IsNotEmpty()
  @MinLength(6, { message: "You must enter at last 6 characters" })
  public password: string | undefined;
}
