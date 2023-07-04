import garavatar from "gravatar";
import bcryptjs from "bcryptjs";
import { DataStoreInToken, TokenData } from "@modules/auth";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exceptions";
import jwt from "jsonwebtoken";
import LoginDto from "./auth.dto";
import { IUser, UserSchema } from "@modules/user";

class AuthServices {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({
      email: model.email,
    });
    if (!user) {
      throw new HttpException(409, `Your email ${model.email} is not exits`);
    }

    const isMatchPassword = await bcryptjs.compare(
      model.password!,
      user.password
    );
    if (!isMatchPassword) {
      throw new HttpException(400, "Credential is not valid");
    }
    return this.createToken(user);
  }

  public async getCurrentLoginUSer(userID: string): Promise<IUser> {
    const user = await this.userSchema.findById(userID);
    if (!user) {
      throw new HttpException(404, `User is not exits`);
    }

    return user;
  }

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoreInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn: number | string = 3600;
    return {
      token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }
}

export default AuthServices;
