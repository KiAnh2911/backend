export interface IPosts {
  _id: string;
  user: string;
  text: string;
  name: string;
  avatar: string;
  likes: ILikes[];
  comments: IComment[];
  shares: IShares[];
  date: Date;
}

export interface ILikes {
  user: string;
}

export interface IShares {
  user: string;
}

export interface IComment {
  _id: string;
  user: string;
  text: string;
  name: string;
  avatar: string;
  date: Date;
}
