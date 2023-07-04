import { IUser, UserSchema } from "@modules/user";
import CreateGroupDto from "./dtos/create_groups.dto";
import { IGroup, IManager, IMember } from "./groups.interface";
import { HttpException } from "@core/exceptions";
import { GroupSchema } from ".";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupService {
  // create group
  public createGroup = async (
    userId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> => {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exits");

    const exitstingGroup = await GroupSchema.find({
      $or: [{ name: groupDto.name }, { code: groupDto.code }],
    }).exec();
    if (exitstingGroup.length > 0)
      throw new HttpException(400, "Name or code existed");

    const newGroup = new GroupSchema({
      ...groupDto,
    });

    const group = await newGroup.save();

    return group;
  };

  // get all group
  public getAllGroup = async (): Promise<IGroup[]> => {
    const groups = GroupSchema.find().sort({ date: -1 }).exec();

    return groups;
  };

  // update group
  public updateGroup = async (
    groupId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> => {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exits");

    const existingGroup = await GroupSchema.find({
      $and: [
        { $or: [{ name: groupDto.name }, { code: groupDto.code }] },
        { _id: { $ne: { _id: groupId } } },
      ],
    }).exec();

    if (existingGroup.length > 0)
      throw new HttpException(400, " Name or code existed");

    const groupFields = { ...groupDto };

    const upadteGroups = await GroupSchema.findOneAndUpdate(
      { _id: groupId },
      { $set: groupFields },
      { new: true }
    ).exec();

    if (!upadteGroups) throw new HttpException(400, "Update is not success");

    return upadteGroups;
  };

  // delete group
  public deleteGroup = async (groupId: string): Promise<IGroup> => {
    const groups = await GroupSchema.findById(groupId).exec();
    if (!groups) throw new HttpException(400, "Group id is not exist");

    const deleteGroup = await GroupSchema.findOneAndDelete({
      _id: groupId,
    }).exec();

    if (!deleteGroup) throw new HttpException(400, " Update is not success");

    return deleteGroup;
  };

  // join group
  public joinGroup = async (userId: string, groupId: string) => {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exits");

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.member_request &&
      group.member_request.some(
        (mem: IMember) => mem.user.toString() === userId
      )
    ) {
      throw new HttpException(
        400,
        "You has already been resquested to join this group"
      );
    }

    if (
      group.members &&
      group.members.some((mem: IMember) => mem.user.toString() === userId)
    ) {
      throw new HttpException(
        400,
        "You has already been be member of this group"
      );
    }

    group.member_request.unshift({
      user: userId,
    } as IMember);

    await group.save();

    return group;
  };

  // approve join group

  public async approveJoinGroup(
    userId: string,
    groupId: string
  ): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exist");

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.member_request &&
      group.member_request.some(
        (item: IMember) => item.user.toString() !== userId
      )
    ) {
      throw new HttpException(400, "There is not any request of this user");
    }

    if (
      group.members &&
      group.members.some((item: IMember) => item.user.toString() === userId)
    ) {
      throw new HttpException(400, "This user has already been in group");
    }

    group.member_request = group.member_request.filter(
      ({ user }) => user.toString() !== userId
    );

    group.members.unshift({ user: userId } as IMember);

    await group.save();
    return group;
  }

  // add manager

  public addManager = async (
    groupId: string,
    request: SetManagerDto
  ): Promise<IGroup> => {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exist");

    const user = await UserSchema.findById(request.userId)
      .select("-password")
      .exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.manager &&
      group.manager.some(
        (manager: IManager) => manager.user.toString() === request.userId
      )
    ) {
      throw new HttpException(
        400,
        "You has already been set manager to this group "
      );
    }

    group.manager.unshift({
      user: request.userId,
      role: request.role,
    } as IManager);

    await group.save();

    return group;
  };

  // remove manager

  public removeManager = async (
    groupId: string,
    userId: string
  ): Promise<IGroup> => {
    const group = await GroupSchema.findById(groupId).exec();

    if (!group) throw new HttpException(400, "Group id is not exist");

    const user = await GroupSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exits");

    if (
      group.manager &&
      group.manager.some(
        (manager: IManager) => manager.user.toString() !== userId
      )
    ) {
      throw new HttpException(
        400,
        "You has not yet been manager of this group "
      );
    }

    group.manager = group.manager.filter(
      ({ user }) => user.toString() !== userId
    );
    await group.save();

    return group;
  };

  // get all members on group
  public getAllMembers = async (groupId: string): Promise<IUser[]> => {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is exits");

    const userIds = group.members.map((mem) => {
      return mem.user;
    });
    const users = UserSchema.find({ _id: userIds }).select("-password").exec();
    return users;
  };

  // remove member
  public removeMember = async (
    groupId: string,
    userId: string
  ): Promise<IGroup> => {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is exits");

    const user = await GroupSchema.findById(userId).exec();
    if (!user) throw new HttpException(400, "User id is not exits");

    if (
      group.members &&
      group.members.findIndex(
        (member: IMember) => member.user.toString() === userId
      ) == -1
    ) {
      throw new HttpException(400, "You has not been member of this group ");
    }

    if (group.members.length == 1)
      throw new HttpException(400, "You are last member of this group");

    group.members = group.members.filter(
      ({ user }) => user.toString() !== userId
    );

    await group.save();

    return group;
  };
}
