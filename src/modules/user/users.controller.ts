import { NextFunction, Request, Response } from "express";
import { RegisterDto } from "./dtos";
import UserServices from "./users.services";
import { TokenData } from "@modules/auth";

export default class UsersController {
  private userService = new UserServices();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;

      const tokenData: TokenData = await this.userService.createUser(model);

      res.status(201).json(tokenData);
    } catch (error) {
      next(error);
    }
  };
  // get user by id
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID: string = req.params.id;

      const user = await this.userService.getUSerByID(userID);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  // get all
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getAll();

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  // get all paging
  public getAllPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page: number = parseInt(req.params.page);
      const keyword = req.query.keyword || "";

      const paginationResult = await this.userService.getAllPaging(
        keyword.toString(),
        page
      );

      res.status(200).json(paginationResult);
    } catch (error) {
      next(error);
    }
  };

  // delete user
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const result = await this.userService.deleteUser(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // update user
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: RegisterDto = req.body;

      const user = await this.userService.updateUser(req.params.id, model);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
