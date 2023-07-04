import { NextFunction, Request, Response } from "express";
import ConversationServices from "./conversations.services";
import SendMessageDto from "./dtos/send_message.dto";

export default class ConversationController {
  private conversationService = new ConversationServices();
  // send message
  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const model: SendMessageDto = req.body;
    try {
      const result = await this.conversationService.sendMessage(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  // get my conversation
  public getMyConverSation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    try {
      const result = await this.conversationService.getMyConverSation(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
