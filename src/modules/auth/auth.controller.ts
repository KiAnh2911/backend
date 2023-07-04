import { NextFunction, Request, Response } from "express";

import { TokenData } from "@modules/auth";
import AuthServices from "./auth.services";
import LoginDto from "./auth.dto";

export default class AuthController {
  private authService = new AuthServices();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;

      const tokenData: TokenData = await this.authService.login(model);

      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentLoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.authService.getCurrentLoginUSer(req.user.id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}