import { Router } from "express";
import { Route } from "@core/interface";
import UsersController from "./users.controller";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { RegisterDto } from "./dtos";

export default class UsersRoute implements Route {
  public path = "/api/v1/users";
  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.intializeRouters();
  }

  private intializeRouters() {
    /**
     * RegisterDto model
     * @typedef {object} RegisterDto
     * @property {string} email.required - email address
     * @property {string} password.required - password
     * @property {string} first_name.required - first_name
     * @property {string} last_name.required - last_name
     */
    /**
     * POST /api/v1/users
     * @summary API local resgiter
     * @tags users
     * @param {RegisterDto} request.body.required
     * @return {TokenData} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.post(
      this.path,
      validationMiddleware(RegisterDto, true),
      this.usersController.register
    );

    /**
     * Get /api/v1/users/{id}
     * @summary API local getUserById
     * @tags users
     * @param {string} id.path.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.get(this.path + "/:id", this.usersController.getUserById);

    /**
     * Get /api/v1/users
     * @summary API local getAllUser
     * @tags users
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.get(this.path, this.usersController.getAll);

    /**
     * Get /api/v1/users/paging/{page}
     * @summary API local getAllPaging
     * @tags users
     * @param {page} page.path.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.get(
      this.path + "/paging/:page",
      this.usersController.getAllPaging
    );

    /**
     * Get /api/v1/users/paging/{page}/{keyword}
     * @summary API local getAllPaging
     * @tags users
     * @param {page} page.path.required
     * @param {keyword} keyword.path.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.get(
      this.path + "/paging/:page/:keyword",
      this.usersController.getAllPaging
    );
    /**
     * DELETE /api/v1/users/{id}
     * @summary API local update user
     * @tags users
     * @param {id} id.path.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    // route delete user
    this.router.delete(
      this.path + "/:id",
      authMiddleware,
      this.usersController.deleteUser
    );
    /**
     * RegisterDto model
     * @typedef {object} RegisterDto
     * @property {string} email.required - email address
     * @property {string} password.required - password
     * @property {string} first_name.required - first_name
     * @property {string} last_name.required - last_name
     */
    /**
     * PUT /api/v1/users/{id}
     * @summary API local update user
     * @tags users
     * @param {id} id.path.required
     * @param {RegisterDto} request.body.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.put(
      this.path + "/:id",
      authMiddleware,
      validationMiddleware(RegisterDto, true),
      this.usersController.updateUser
    );
  }
}
