export interface IProfile {
  _id: string;
  user: string;
  company: string;
  website: string;
  location: string;
  status: string;
  skills: string[];
  bio: string;
  experience: IExperience[];
  education: IEducation[];
  following: IFollower[];
  follower: IFollower[];
  social: ISocial;
  friends: IFriends[];
  friend_request: IFriends[];
  date: Date;
}

export interface IFriends {
  user: string;
  date: Date;
}

export interface IExperience {
  _id: string;
  title: string;
  company: string;
  location: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface IEducation {
  _id: string;
  school: string;
  degree: string;
  fieldofstudy: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface ISocial extends Record<string, string> {
  youtube: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface IFollower {
  user: string;
}
