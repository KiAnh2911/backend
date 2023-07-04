export interface IConversation {
  user1: string;
  user2: string;
  date: Date;
  recent_date: Date;
  message: IMessage[];
}

export interface IMessage {
  from: string;
  to: string;
  read: boolean;
  text: string;
  date: Date;
  show_on_from: boolean;
  show_on_to: boolean;
}
