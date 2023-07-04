import express, { json } from 'express';
import mongoose from 'mongoose';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { Route } from '@core/interface';
import { Logger } from '@core/utils';
import { errorMiddleware } from '@core/middleware';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { SWAGGER_OPTIONS } from '@contains/openApi';

class App {
  public app: express.Application;
  public port: string | number;
  public production: boolean;

  constructor(routes: Route[]) {
    this.app = express();

    this.port = process.env.PORT || 5000;
    this.production = process.env.NODE_ENV == 'production' ? true : false;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorMiddleware();
    this.intializeSwagger();
  }

  private initializeMiddlewares() {
    if (this.production) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan('combined'));
      this.app.use(cors({ origin: 'social-admin-prod.herokuapp.com', credentials: true }));
    } else {
      this.app.use(morgan('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }
    this.app.use(json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);

      // log list router
      // route.router.stack
      //   .filter((r: any) => r.route)
      //   .forEach((endpoint: any) => {
      //     Logger.info(
      //       `${Object.keys(endpoint.route.methods)[0].toUpperCase()} :  ${
      //         endpoint.route.path
      //       }`
      //     );
      //   });
    });
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  public Listen() {
    this.app.listen(this.port, () => {
      Logger.info(`server is listening on port ${this.port}`);
    });
  }

  private connectToDatabase() {
    try {
      const connectString = process.env.MONGO_URI;
      if (!connectString) {
        Logger.error('Connect string is invalid');
        return;
      }
      mongoose.connect(connectString);
      Logger.info('Database connect....');
    } catch (error) {
      Logger.error('Connect to database error');
    }
  }

  private intializeSwagger() {
    expressJSDocSwagger(this.app)(SWAGGER_OPTIONS);
  }
}

export default App;
