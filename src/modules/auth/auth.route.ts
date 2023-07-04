import { Router } from 'express';
import { Route } from '@core/interface';
import { authMiddleware } from '@core/middleware';
import AuthController from './auth.controller';

export default class AuthRoute implements Route {
  public path = '/api/v1/auth';
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.intializeRouters();
  }

  private intializeRouters() {
    /**
     * LoginDto model
     * @typedef {object} LoginDto
     * @property {string} email.required - email address
     * @property {string} password.required - password
     */
    /**
     * LoginRes model
     * @typedef {object} TokenData
     * @property {string} token - json web token
     * @property {string} refreshToken - json web token
     */
    /**
     * POST /api/v1/auth
     * @summary API local login
     * @tags auth
     * @param {LoginDto} request.body.required
     * @return {TokenData} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.post(this.path, this.authController.login);

    /**
     * GET /api/v1/auth
     * @summary API get current user login
     * @tags auth
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.get(this.path, authMiddleware, this.authController.getCurrentLoginUser); // GET : http://localhost:5000/api/auth -> Require login

    /**
     * LoginRes model
     * @typedef {object} TokenData
     * @property {string} token - json web token
     * @property {string} refreshToken - json web token
     */
    /**
     * POST /api/v1/auth/refresh-token
     * @summary API refresh token
     * @tags auth
     * @param {object} request.body.required
     * @return {TokenData} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.post(this.path + '/refresh-token', this.authController.refreshToken);
    /**
     * LoginRes model
     * @typedef {object} TokenData
     * @property {string} token - json web token
     * @property {string} refreshToken - json web token
     */
    /**
     * POST /api/v1/auth/revoke-token
     * @summary API revoke token
     * @tags auth
     * @param {object} request.body.required
     * @return {TokenData} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.post(this.path + '/revoke-token', authMiddleware, this.authController.revokeToken);
  }
}
