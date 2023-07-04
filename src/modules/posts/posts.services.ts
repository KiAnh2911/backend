import { HttpException } from "@core/exceptions";
import { PostSchema } from ".";
import { UserSchema } from "@modules/user";
import { IComment, ILikes, IPosts, IShares } from "./posts.interface";
import CreatePostDto from "./dtos/create_post.dto";
import IPagination from "@core/interface/pagination.interface";
import CreateCommentDto from "./dtos/create_commet_post.dto";
import { ProfileSchema } from "@modules/profile";

export default class PostServices {
  // create post
  public createPost = async (
    userId: string,
    posts: CreatePostDto
  ): Promise<IPosts> => {
    const user = await UserSchema.findById(userId).select("-password").exec();

    if (!user) throw new HttpException(400, "User id is not exits");

    const newPost = new PostSchema({
      text: posts.text,
      name: user.first_name + " " + user.last_name,
      avatar: user.avatar,
      user: userId,
    });

    const post = await newPost.save();

    return post;
  };

  // update poat
  public updatePost = async (
    postId: string,
    posts: CreatePostDto
  ): Promise<IPosts> => {
    const updatePostById = await PostSchema.findByIdAndUpdate(
      postId,
      { ...posts },
      { new: true }
    ).exec();

    if (!updatePostById) throw new HttpException(400, "Post is not found");

    return updatePostById;
  };

  // get all post
  public getAllPosts = async (): Promise<IPosts[]> => {
    const allPost = await PostSchema.find().sort({ date: -1 }).exec();

    return allPost;
  };

  // get post by id
  public getPostById = async (postId: string): Promise<IPosts> => {
    const posts = await PostSchema.findById(postId).exec();

    if (!posts) throw new HttpException(400, "Post is not found");

    return posts;
  };

  // get paging

  public getAllPaging = async (
    keyword: string,
    page: number
  ): Promise<IPagination<IPosts>> => {
    const pageSize: number = Number(process.env.PAGE_SIZE) | 10;
    let query = {};
    if (keyword) {
      query = {
        $or: [{ text: keyword }],
      };
    }

    const posts = await PostSchema.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const rowCount = await PostSchema.find(query).countDocuments().exec();

    if (!posts) throw new HttpException(400, "Post is not found");

    return {
      total: rowCount,
      page: page,
      pageSize: pageSize,
      items: posts,
    } as IPagination<IPosts>;
  };

  //delete post
  public deletePost = async (userId: string, postId: string) => {
    const post = await PostSchema.findByIdAndRemove(postId).exec();

    if (!post) throw new HttpException(400, "Post is not found ");

    if (post.user.toString() !== userId)
      throw new HttpException(400, "User is not authorized");

    return post;
  };

  // like posts
  public LikePost = async (
    userId: string,
    postId: string
  ): Promise<ILikes[]> => {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    if (post.likes.some((like: ILikes) => like.user.toString() === userId))
      throw new HttpException(400, "Post already liked");

    post.likes.unshift({ user: userId });

    await post.save();

    return post.likes;
  };

  // unlike posts
  public UnlikePost = async (
    userId: string,
    postId: string
  ): Promise<ILikes[]> => {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    if (!post.likes.some((like: ILikes) => like.user.toString() === userId))
      throw new HttpException(400, "Post has not yet been liked");

    post.likes = post.likes.filter(({ user }) => user.toString() !== userId);

    await post.save();

    return post.likes;
  };

  //  create comment

  public addComment = async (
    comment: CreateCommentDto
  ): Promise<IComment[]> => {
    const post = await PostSchema.findById(comment.postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    const user = await UserSchema.findById(comment.userId)
      .select("-password")
      .exec();

    if (!user) throw new HttpException(400, "User not found ");

    const newComment = {
      text: comment.text,
      name: user.first_name + " " + user.last_name,
      avatar: user.avatar,
      user: comment.userId,
    };

    post.comments.unshift(newComment as IComment);

    await post.save();

    return post.comments;
  };

  // delete comment
  public deleteComment = async (
    commentId: string,
    postId: string,
    userId: string
  ): Promise<IComment[]> => {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) throw new HttpException(400, "Comment not found");

    if (comment.user.toString() !== userId)
      throw new HttpException(401, "User not authorized");

    post.comments = post.comments.filter(
      ({ _id }) => _id.toString() !== commentId
    );

    await post.save();

    return post.comments;
  };

  // create share
  public Share = async (userId: string, postId: string): Promise<IShares[]> => {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    if (
      post.shares &&
      post.shares.some((s: IShares) => s.user.toString() === userId)
    )
      throw new HttpException(400, "Post already shares ");

    if (!post.shares) post.shares = [];

    post.shares.unshift({ user: userId });
    await post.save();

    return post.shares;
  };

  // delete share

  public deleteShare = async (
    userId: string,
    postId: string
  ): Promise<IShares[]> => {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    if (
      post.shares &&
      !post.shares.some((s: IShares) => s.user.toString() === userId)
    )
      throw new HttpException(400, "Post has not yet been shares");

    if (!post.shares) post.shares = [];
    post.shares = post.shares.filter(({ user }) => user.toString() !== userId);

    post.save();

    return post.shares;
  };
}
