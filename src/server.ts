require("dotenv").config();

import App from "./app";

import { validateEnv } from "@core/utils";
import { AuthRoute } from "@modules/auth";
import { IndexRoute } from "@modules/index";
import { UsersRoute } from "@modules/user";
import { ProfileRoute } from "@modules/profile";
import { PostRoute } from "@modules/posts";
import { GroupRoute } from "@modules/groups";
import { ConversationRoute } from "@modules/conversations";

validateEnv();

const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PostRoute(),
  new GroupRoute(),
  new ConversationRoute(),
];

const app = new App(routes);

app.Listen();

export {};
