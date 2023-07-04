import { NextFunction, Request, Response } from "express";

import { IUser } from "@modules/user";
import CreateProfileDto from "./dtos/create_profile.dtos";
import { IProfile } from "./profile.interface";
import ProfileServices from "./profile.services";
import AddExperienceDto from "./dtos/add_exprience.dto";
import EducationDto from "./dtos/add_education.dto";

class ProfileController {
  private profileServices = new ProfileServices();
  // get current profile
  public getCurrentProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const resultObj: Partial<IUser> =
        await this.profileServices.getCurrentProfile(userId);
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };
  // create profile

  public createProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: CreateProfileDto = req.body;
    const userId = req.user.id;
    try {
      const creatUserData: IProfile = await this.profileServices.createProfile(
        userId,
        userData
      );
      res.status(201).json({ data: creatUserData });
    } catch (error) {
      next(error);
    }
  };
  // get by user id

  public getByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updateData: Partial<IUser> =
        await this.profileServices.getCurrentProfile(req.params.id);
      res.status(200).json({ data: updateData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  // get all profiles

  public getAllProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resultData: Partial<IUser>[] =
        await this.profileServices.getAllProfiles();
      res.status(200).json(resultData);
    } catch (error) {
      next(error);
    }
  };

  //  delete profile
  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const useId = req.params.id;

    try {
      await this.profileServices.deleteProfile(useId);
      res.status(200);
    } catch (error) {
      next(error);
    }
  };

  // add experience
  public createExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const expData: AddExperienceDto = req.body;
    const userId = req.user.id;

    try {
      const createUserData = await this.profileServices.addExperience(
        userId,
        expData
      );
      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };
  // delete experience
  public deleteExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const expId = req.params.exp_id;
    try {
      const profile = await this.profileServices.deleteExperience(
        userId,
        expId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
  // add experience
  public createEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const eduData: EducationDto = req.body;
    const userId = req.user.id;

    try {
      const createUserData = await this.profileServices.addEducation(
        userId,
        eduData
      );
      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };
  // delete education
  public deleteEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const eduId = req.params.edu_id;
    try {
      const profile = await this.profileServices.deleteEducation(userId, eduId);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  };

  // follow
  public follow = async (req: Request, res: Response, next: NextFunction) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileServices.follow(req.user.id, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  // unfollow
  public unfollow = async (req: Request, res: Response, next: NextFunction) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileServices.unFollow(
        req.user.id,
        toUserId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  // add friend
  public addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const useId = req.user.id;
    const toUserId = req.params.id;
    try {
      const profile = await this.profileServices.addFriend(useId, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  //un friend
  public unFriend = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const toUserId = req.params.id;
    try {
      const profile = await this.profileServices.unFriend(userId, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  // accept friend request

  public acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const toUserId = req.params.id;
    try {
      const profile = await this.profileServices.acceptFriendRequest(
        userId,
        toUserId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
