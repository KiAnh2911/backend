import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateGroupDto from "./dtos/create_groups.dto";
import GroupController from "./groups.controller";
import { Route } from "@core/interface";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupRoute implements Route {
  public path = "/api/v1/groups";
  public router = Router();

  public groupsController = new GroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //router create group
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateGroupDto, true),
      this.groupsController.createGroup
    );
    //router get all group
    this.router.get(`${this.path}`, this.groupsController.getAllGroup);
    // router update group
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateGroupDto, true),
      this.groupsController.updateGroup
    );
    // router delete group
    this.router.delete(`${this.path}/:id`, this.groupsController.deleteGroup);

    ////// Member

    // join group
    this.router.post(
      `${this.path}/members/:id`,
      authMiddleware,
      this.groupsController.joinGroup
    );
    // approve join group
    this.router.put(
      `${this.path}/members/:user_id/:group_id`,
      authMiddleware,
      this.groupsController.joinGroup
    );
    // get all members
    this.router.get(
      `${this.path}/members/:id`,
      this.groupsController.getAllMembers
    );
    // remove member
    this.router.delete(
      `${this.path}/members/:group_id/:user_id`,
      authMiddleware,
      this.groupsController.removeMember
    );

    //////// Manager

    // add manager
    this.router.post(
      `${this.path}/manager/:id`,
      authMiddleware,
      validationMiddleware(SetManagerDto, true),
      this.groupsController.addManager
    );
    // approve join group
    this.router.delete(
      `${this.path}/manager/:group_id/:user_id`,
      authMiddleware,
      this.groupsController.removeManager
    );
  }
}
