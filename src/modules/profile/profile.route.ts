import { Router } from "express";

import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Route } from "@core/interface";
import ProfileController from "./profile.controller";
import CreateProfileDto from "./dtos/create_profile.dtos";

export default class ProfileRoute implements Route {
  public path = "/api/v1/profile";
  public router = Router();

  public profileController = new ProfileController();

  constructor() {
    this.intializeRouters();
  }

  private intializeRouters() {
    //route get current profile
    this.router.get(
      `${this.path}/user/:id`,
      this.profileController.getByUserId
    );

    // route get all profiles
    this.router.get(`${this.path}`, this.profileController.getAllProfiles);

    // get current profile
    this.router.get(
      `${this.path}/me`,
      authMiddleware,
      this.profileController.getCurrentProfile
    );
    1;
    // route create profile
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateProfileDto, true),
      this.profileController.createProfile
    ); // POST : http://localhost:5000/api/v1/profile

    // route delete profile
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.profileController.deleteProfile
    );

    //route update experience
    this.router.put(
      `${this.path}/experience`,
      authMiddleware,
      this.profileController.createExperience
    );

    //route delete experience
    this.router.delete(
      `${this.path}/experience/:exp_id`,
      authMiddleware,
      this.profileController.deleteExperience
    );

    //route update education
    this.router.put(
      `${this.path}/education`,
      authMiddleware,
      this.profileController.createEducation
    );

    //route delete education
    this.router.delete(
      `${this.path}/education/:edu_id`,
      authMiddleware,
      this.profileController.deleteEducation
    );

    // route follow
    this.router.post(
      `${this.path}/following/:id`,
      authMiddleware,
      this.profileController.follow
    );
    // route unfollow
    this.router.delete(
      `${this.path}/following/:id`,
      authMiddleware,
      this.profileController.unfollow
    );
    // route friend
    this.router.post(
      `${this.path}/friend/:id`,
      authMiddleware,
      this.profileController.addFriend
    );
    // route un friend
    this.router.delete(
      `${this.path}/friend/:id`,
      authMiddleware,
      this.profileController.unFriend
    );
    // accept Friend Request
    this.router.put(
      `${this.path}/friend/:id`,
      authMiddleware,
      this.profileController.acceptFriendRequest
    );
  }
}
