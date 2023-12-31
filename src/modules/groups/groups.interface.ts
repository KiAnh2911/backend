export interface IGroup {
  _id: string;
  name: string;
  code: string;
  description: string;
  members: IMember[];
  member_request: IMember[];
  manager: IManager[];
  date: Date;
  creator: string;
}

export interface IMember {
  user: string;
  join_date: Date;
}

export interface IManager {
  user: string;
  role: string;
}
