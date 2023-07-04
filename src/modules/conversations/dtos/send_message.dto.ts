import { IsNotEmpty } from "class-validator";

export default class SendMessageDto {
  @IsNotEmpty()
  public conversationId: string | undefined;
  @IsNotEmpty()
  public to: string | undefined;
  @IsNotEmpty()
  public text: string | undefined;
}
