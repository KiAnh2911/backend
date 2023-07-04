import garavatar from 'gravatar';
import bcryptjs from 'bcryptjs';
import { RegisterDto } from './dtos';
import UserSchema from './users.model';
import { TokenData } from '@modules/auth';
import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exceptions';
import IUser from './users.interface';
import IPagination from '@core/interface/pagination.interface';
import { RefreshTokenSchema } from '@modules/refresh_token';
import { generateJwtToken, randomTokenString } from '@core/utils/helpers';

class UserServices {
  public userSchema = UserSchema;
  // create user
  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await this.userSchema.findOne({ email: model.email }).exec();
    if (user) {
      throw new HttpException(409, `Your email ${model.email} already exist.`);
    }

    const avatar = garavatar.url(model.email ?? '', {
      size: '200',
      rating: 'g',
      default: 'mm',
    });

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(model.password ?? '', salt);
    const createdUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
      date: Date.now(),
    });
    const refreshToken = await this.generateRefreshToken(createdUser._id);
    await refreshToken.save();

    return generateJwtToken(createdUser._id, refreshToken.token);
  }
  // update user
  public async updateUser(userID: string, model: RegisterDto): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await this.userSchema.findById(userID).exec();
    if (!user) {
      throw new HttpException(400, `User id is not exist`);
    }

    let avatar = user.avatar;

    const checkEmailExist = await this.userSchema
      .find({
        $and: [{ email: { $eq: model.email } }, { _id: { $ne: userID } }],
      })
      .exec();
    if (checkEmailExist.length !== 0) {
      throw new HttpException(400, 'Your email has been used by another user');
    }

    avatar = garavatar.url(model.email ?? '', {
      size: '200',
      rating: 'g',
      default: 'mm',
    });

    let updateUserById;
    if (model.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(model.password, salt);
      updateUserById = await this.userSchema
        .findByIdAndUpdate(
          userID,
          {
            ...model,
            avatar: avatar,
            password: hashedPassword,
          },
          { new: true },
        )
        .exec();
    } else {
      updateUserById = await this.userSchema
        .findByIdAndUpdate(
          userID,
          {
            ...model,
            avatar: avatar,
          },
          { new: true },
        )
        .exec();
    }

    if (!updateUserById) throw new HttpException(409, 'You are not an user');

    return updateUserById;
  }
  // get user theo id
  public async getUSerByID(userID: string): Promise<IUser> {
    const user = await this.userSchema.findById(userID);
    if (!user) {
      throw new HttpException(404, `User is not exits`);
    }

    return user;
  }
  // get all user
  public async getAll(): Promise<IUser[]> {
    const user = await this.userSchema.find();
    if (!user) {
      throw new HttpException(404, `User is not exits`);
    }

    return user;
  }

  // get all user page
  public async getAllPaging(keyword: string, pageInt: number): Promise<IPagination<IUser>> {
    const pageSize: number = Number(process.env.PAGE_SIZE) || 10;

    let query = {};
    if (keyword) {
      query = {
        $or: [{ email: keyword }, { first_name: keyword }, { last_name: keyword }],
      };
    }

    const users = await this.userSchema
      .find(query)
      .skip((pageInt - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const rowCount = await this.userSchema.find(query).countDocuments().exec();

    return {
      total: rowCount,
      page: pageInt,
      pageSize: pageSize,
      items: users,
    } as IPagination<IUser>;
  }

  // delete user
  public async deleteUser(userID: string): Promise<IUser> {
    const delteUser = await this.userSchema.findByIdAndDelete(userID).exec();
    if (!delteUser) throw new HttpException(404, `Your id is invalid`);
    return delteUser;
  }

  // token
  private async generateRefreshToken(userId: string) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}

export default UserServices;
