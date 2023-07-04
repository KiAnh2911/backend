import { UserSchema } from "@modules/user";
import { HttpException } from "@core/exceptions";
import SendMessageDto from "./dtos/send_message.dto";
import { IConversation, IMessage } from "./conversations.interface";
import { ConversationSchema } from ".";

export default class ConversationServices {
  // send message
  public sendMessage = async (
    userId: string,
    messageDto: SendMessageDto
  ): Promise<IConversation> => {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exits");

    const toUser = await UserSchema.findById(messageDto.to).exec();
    if (!toUser) throw new HttpException(400, "To user id is not exits");

    if (!messageDto.conversationId) {
      let newConversation = await ConversationSchema.findOne({
        $or: [
          { $and: [{ user1: userId }, { user2: messageDto.to }] },
          {
            $and: [{ user2: userId }, { user1: messageDto.to }],
          },
        ],
      }).exec();

      if (newConversation) {
        newConversation.message.unshift({
          to: messageDto.to,
          text: messageDto.text,
          from: userId,
        } as IMessage);
      } else {
        newConversation = new ConversationSchema({
          user1: userId,
          user2: messageDto.to,
          messages: [
            {
              from: userId,
              to: messageDto.to,
              text: messageDto.text,
            },
          ],
        });
      }

      await newConversation.save();

      return newConversation;
    } else {
      const conversation = await ConversationSchema.findById(
        messageDto.conversationId
      ).exec();

      if (!conversation)
        throw new HttpException(400, "Conversation id is not exits");

      if (
        (conversation.user1 !== userId &&
          conversation.user2 !== messageDto.to) ||
        (conversation.user1 !== messageDto.to && conversation.user2 !== userId)
      ) {
        throw new HttpException(400, "Conversation id is not valid");
      }

      conversation.message.unshift({
        to: messageDto.to,
        text: messageDto.text,
        from: userId,
      } as IMessage);

      await conversation.save();

      return conversation;
    }
  };

  // get my conversation

  public getMyConverSation = async (
    userId: string
  ): Promise<IConversation[]> => {
    const user = await UserSchema.findById(userId).select("-password").exec();

    if (!user) throw new HttpException(400, "User id is not exits");

    const conversations = await ConversationSchema.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .sort({ recent_date: -1 })
      .exec();

    return conversations;
  };
}
