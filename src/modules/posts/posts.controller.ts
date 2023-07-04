import { NextFunction, Request, Response } from "express";
import PostServices from "./posts.services";
import CreatePostDto from "./dtos/create_post.dto";

export default class PostsController {
  private PostServices = new PostServices();

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const userId = req.user.id;

      const result = await this.PostServices.createPost(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const postId = req.params.id;

      const result = await this.PostServices.updatePost(postId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const allPosts = await this.PostServices.getAllPosts();

      res.status(200).json(allPosts);
    } catch (error) {
      next(error);
    }
  };

  public getByIdPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;

      const post = await this.PostServices.getPostById(postId);

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public getAllPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageSize: number = Number(req.params.page);
      const keyword = req.query.text || "";

      const posts = await this.PostServices.getAllPaging(
        keyword.toString(),
        pageSize
      );

      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const deletePost = await this.PostServices.deletePost(userId, postId);

      res.status(200).json(deletePost);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const likePost = await this.PostServices.LikePost(userId, postId);

      res.status(200).json(likePost);
    } catch (error) {
      next(error);
    }
  };

  public unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const unlikePost = await this.PostServices.UnlikePost(userId, postId);

      res.status(200).json(unlikePost);
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const text = req.body.text;
      const userId = req.user.id;
      const postId = req.params.id;

      const result = await this.PostServices.addComment({
        text,
        userId,
        postId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const commentId = req.params.comment_id;

      const result = await this.PostServices.deleteComment(
        commentId,
        postId,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public sharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const shared = await this.PostServices.Share(userId, postId);
      res.status(200).json(shared);
    } catch (error) {
      next(error);
    }
  };

  public deleteShare = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const shared = await this.PostServices.deleteShare(userId, postId);
      res.status(200).json(shared);
    } catch (error) {
      next(error);
    }
  };
}
