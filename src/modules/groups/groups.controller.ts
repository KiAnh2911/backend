import { NextFunction, Request, Response } from "express";
import GroupService from "./groups.services";
import { IGroup } from "./groups.interface";
import CreateGroupDto from "./dtos/create_groups.dto";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupController {
  private groupService = new GroupService();

  public createGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const model: CreateGroupDto = req.body;
    try {
      const result = await this.groupService.createGroup(userId, model);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  // get all group
  public getAllGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.groupService.getAllGroup();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // update group
  public updateGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const groupId = req.params.id;
    const model: CreateGroupDto = req.body;

    try {
      const result = await this.groupService.updateGroup(groupId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  // delete group
  public deleteGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const groupId = req.params.id;

    try {
      const result = await this.groupService.deleteGroup(groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // join group
  public joinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const groupId = req.params.id;
    try {
      const result = await this.groupService.joinGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // approve join group

  public approveJoinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = req.params.group_id;
      const userId = req.params.user_id;
      const group = await this.groupService.approveJoinGroup(userId, groupId);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  // add manager

  public addManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = req.params.id;
      const model: SetManagerDto = req.body;
      const group = await this.groupService.addManager(groupId, model);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  // remove manager

  public removeManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = req.params.group_id;
      const userId = req.params.user_id;
      const group = await this.groupService.removeManager(groupId, userId);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  // get all members
  public getAllMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const groupId = req.params.id;
    try {
      const user = await this.groupService.getAllMembers(groupId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  // remove Member
  public removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const groupId = req.params.group_id;
    const userId = req.params.user_id;

    try {
      const group = await this.groupService.removeMember(groupId, userId);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };
}
