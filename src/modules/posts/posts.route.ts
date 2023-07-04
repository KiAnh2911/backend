import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreatePostDto from "./dtos/create_post.dto";
import PostsController from "./posts.controller";
import CreateCommentDto from "./dtos/create_commet_post.dto";
import { Route } from "@core/interface";

export default class PostRoute implements Route {
  public path = "/api/v1/posts";
  public router = Router();

  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // route create post
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.createPost
    );

    // route update post
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.updatePost
    );

    // route get all posts
    this.router.get(`${this.path}`, this.postsController.getAllPosts);

    // route get by id
    this.router.get(`${this.path}/:id`, this.postsController.getByIdPost);

    // route get all paging
    this.router.get(
      `${this.path}/paging/:page`,
      this.postsController.getAllPaging
    );

    // route delete post
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.postsController.deletePost
    );

    // route like post
    this.router.post(
      `${this.path}/like/:id`,
      authMiddleware,
      this.postsController.likePost
    );

    // route unlike post
    this.router.delete(
      `${this.path}/like/:id`,
      authMiddleware,
      this.postsController.unlikePost
    );

    // route add comment
    this.router.post(
      `${this.path}/comments/:id`,
      authMiddleware,
      validationMiddleware(CreateCommentDto, true),
      this.postsController.addComment
    );

    // route delete comment
    this.router.delete(
      `${this.path}/comments/:id/:comment_id`,
      authMiddleware,
      this.postsController.deleteComment
    );
    // route share
    this.router.post(
      `${this.path}/share/:id`,
      authMiddleware,
      this.postsController.sharePost
    );
    // route delete share
    this.router.delete(
      `${this.path}/share/:id`,
      authMiddleware,
      this.postsController.deleteShare
    );
  }
}
