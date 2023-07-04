import { IUser, UserSchema } from "@modules/user";
import { IProfile, ProfileSchema } from ".";
import { HttpException } from "@core/exceptions";
import CreateProfileDto from "./dtos/create_profile.dtos";
import {
  IEducation,
  IExperience,
  IFollower,
  IFriends,
  ISocial,
} from "./profile.interface";
import addHttpPrefix from "@contains/http";
import AddExperienceDto from "./dtos/add_exprience.dto";
import EducationDto from "./dtos/add_education.dto";

class ProfileServices {
  // get current profile
  public async getCurrentProfile(userId: string): Promise<Partial<IUser>> {
    const user = await ProfileSchema.findOne({
      user: userId,
    })
      .populate("user", ["name", "avatar"])
      .exec();
    if (!user) throw new HttpException(400, "There is not profile this user");

    return user;
  }

  // create profile
  public async createProfile(
    userId: string,
    profileDto: CreateProfileDto
  ): Promise<IProfile> {
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = profileDto;

    const profileFields: Partial<IProfile> = {
      user: userId,
      company,
      location,
      website: website && website != "" ? addHttpPrefix(website) : website,
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: string) => " " + skill.trim()),
      status,
    };
    const socialFields: ISocial = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = addHttpPrefix(value);
      }
    }

    profileFields.social = socialFields;

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return profile;
  }

  // delete profile
  public async deleteProfile(userId: string) {
    //remove profile
    await ProfileSchema.findOneAndRemove({ user: userId });
    //remove user
    await UserSchema.findByIdAndDelete({ _id: userId });
  }

  // get all profile
  public async getAllProfiles(): Promise<IProfile[]> {
    const profile = await ProfileSchema.find().populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) throw new HttpException(401, "Profile is not exits");

    return profile;
  }

  // add experience
  public addExperience = async (
    userId: string,
    experience: AddExperienceDto
  ) => {
    const newExp = {
      ...experience,
    };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "There is not profile for this user");
    }

    profile.experience.unshift(newExp as IExperience);
    await profile.save();

    return profile;
  };

  // delete experience
  public deleteExperience = async (useId: string, experienceId: string) => {
    const profile = await ProfileSchema.findOne({ user: useId }).exec();
    if (!profile)
      throw new HttpException(400, "there is not profile for this user");

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== experienceId
    );

    await profile.save();

    return profile;
  };

  // add education
  public addEducation = async (userId: string, education: EducationDto) => {
    const newEdu = { ...education };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile)
      throw new HttpException(400, "There is not profile for this user");

    profile.education.unshift(newEdu as IEducation);
    await profile.save();

    return profile;
  };

  // delete education
  public deleteEducation = async (userId: string, educationId: string) => {
    const profile = await ProfileSchema.findOne({ user: userId }).exec();

    if (!profile)
      throw new HttpException(400, "There is not profile this user");

    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== educationId
    );
    profile.save();

    return profile;
  };

  // add follwer

  public follow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    if (
      fromProfile.following &&
      fromProfile.following.some(
        (fol: IFollower) => fol.user.toString() === toUserId
      )
    )
      throw new HttpException(
        400,
        "Target user has already been followed by from user"
      );

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      toProfile.follower &&
      toProfile.follower.some(
        (fol: IFollower) => fol.user.toString() === fromUserId
      )
    )
      throw new HttpException(
        400,
        "Target user has already been followed by from user"
      );
    if (!fromProfile.following) fromProfile.following = [];

    fromProfile.following.unshift({ user: toUserId });

    if (!toProfile.follower) toProfile.follower = [];

    toProfile.follower.unshift({ user: fromUserId });

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  //  unfollow

  public unFollow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for your user");

    if (
      fromProfile.following &&
      fromProfile.following.some((fol) => fol.user.toString() === toUserId)
    )
      throw new HttpException(400, "You has not been yet followed this user");

    if (
      toProfile.follower &&
      toProfile.follower.findIndex(
        (fol) => fol.user.toString() === fromUserId
      ) !== -1
    ) {
      throw new HttpException(400, "You has not been yet followed this user");
    }

    if (!fromProfile.following) fromProfile.following = [];

    fromProfile.following = fromProfile.following.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.follower) toProfile.follower = [];

    toProfile.follower = toProfile.follower.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  //  friends
  public addFriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for your user");

    if (
      toProfile.friends &&
      toProfile.friends.some(
        (fri: IFriends) => fri.user.toString() === toUserId
      )
    ) {
      throw new HttpException(
        400,
        " You has been already be friend this user "
      );
    }

    if (
      fromProfile.friend_request &&
      fromProfile.friend_request.some(
        (fri_re: IFriends) => fri_re.user.toString() === fromUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has been already send friend request to this user "
      );
    }

    if (!toProfile.friend_request) toProfile.friend_request = [];
    toProfile.friend_request.unshift({ user: fromUserId } as IFriends);

    await toProfile.save();

    return toProfile;
  };

  // un friends

  public unFriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({
      user: toUserId,
    }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for your user");

    if (
      toProfile.friends &&
      toProfile.friends.findIndex(
        (fri: IFriends) => fri.user.toString() === fromUserId
      ) === -1
    ) {
      throw new HttpException(400, "You has not yet be friend this user");
    }

    if (!fromProfile.friends) fromProfile.friends = [];
    fromProfile.friends = fromProfile.friends.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.friends) toProfile.friends = [];
    toProfile.friends = toProfile.friends.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  // accept friend request

  public acceptFriendRequest = async (
    currentUserId: string,
    requestUserId: string
  ) => {
    const currentProfile = await ProfileSchema.findOne({
      user: currentUserId,
    }).exec();

    if (!currentProfile)
      throw new HttpException(400, "There is not profile for your user");

    const requestProfile = await ProfileSchema.findOne({
      user: requestUserId,
    }).exec();

    if (!requestProfile)
      throw new HttpException(400, "There is not profile for your user");

    if (
      requestProfile.friends &&
      requestProfile.friends.some(
        (fri: IFriends) => fri.user.toString() === currentUserId
      )
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    if (
      currentProfile.friends &&
      currentProfile.friends.some(
        (fri: IFriends) => fri.user.toString() === currentUserId
      )
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    if (
      currentProfile.friend_request &&
      currentProfile.friend_request.some(
        (fri_re: IFriends) => fri_re.user.toString() !== requestUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has not any friend request related to this user"
      );
    }

    if (!currentProfile.friend_request) currentProfile.friend_request = [];
    currentProfile.friend_request = currentProfile.friend_request.filter(
      ({ user }) => user.toString() !== requestUserId
    );

    if (!currentProfile.friends) currentProfile.friends = [];
    currentProfile.friends.unshift({ user: requestUserId } as IFriends);

    if (!requestProfile.friends) requestProfile.friends = [];
    requestProfile.friends.unshift({ user: currentUserId } as IFriends);

    await currentProfile.save();
    await requestProfile.save();
    return currentProfile;
  };
}

export default ProfileServices;
