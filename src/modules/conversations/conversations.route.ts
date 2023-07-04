import { Router } from "express";
import { Route } from "@core/interface";
import SendMessageDto from "./dtos/send_message.dto";
import ConversationController from "./conversations.controller";
import { authMiddleware, validationMiddleware } from "@core/middleware";

export default class ConversationRoute implements Route {
  public path = "/api/v1/conversations";
  public router = Router();

  public conversationController = new ConversationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * SendMessageDto model
     * @typedef {object} SendMessageDto
     * @property {string} conversationId.required - conversationId
     * @property {string} to.required - to
     * @property {string} text.required - text
     */
    /**
     * POST /api/v1/conversations
     * @summary API local conversation
     * @tags conversations
     * @param {SendMessageDto} request.body.required
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     * @security JWT
     */
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(SendMessageDto, true),
      this.conversationController.sendMessage
    );
    // router my conversation
    /**
     * Get /api/v1/conversations
     * @summary API local get my conversation
     * @tags conversations
     * @return {object} 200 - success response
     * @return {object} 400 - Bad request response
     *@security JWT
     */
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.conversationController.getMyConverSation
    );
  }
}
