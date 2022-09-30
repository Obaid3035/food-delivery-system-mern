import { IController, IRequest } from '../interface';
import { Response, NextFunction, Request, Router } from 'express';
import auth from '../middleware/auth';
import { Container } from 'typedi';
import UserService from '../service/customer/UserService';
import User, {USER_ROLE} from '../model/user';

class UserController implements IController {
   router = Router();
   path = '/auth';

   constructor() {
      this.initializeRoutes();
   }

   private initializeRoutes() {
      this.router
         .post(`${this.path}/register`, this.register)
         .post(`${this.path}/login`, this.login)
         .post(`${this.path}/reset-link`, this.forgotPassword)
         .get(`${this.path}/authorize/:token`, this.authenticate)
         .get(`${this.path}/current-user`, auth, this.getCurrentUser)
         .put(`${this.path}/reset-password`, auth(USER_ROLE.CUSTOMER), this.resetPassword);
   }

   private register = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      try {
         const userServiceInstance = Container.get(UserService);
         const {  token } = await userServiceInstance.register(req.body);
         res.status(200).json({ token });
      } catch (e) {
         next(e);
      }
   };

   private login = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userServiceInstance = Container.get(UserService);
         const { token } = await userServiceInstance.login(req.body);
         res.status(200).json({  token });
      } catch (e) {
         next(e);
      }
   };

   private forgotPassword = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      try {
         const userServiceInstance = Container.get(UserService);
         const { message } = await userServiceInstance.forgotPassword(
            req.body.email
         );
         res.status(200).json({ message });
      } catch (e) {
         next(e);
      }
   };

   private authenticate = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      try {
         const { token } = req.params;
         await User.verify(token);
         res.status(200).json({ authenticate: true });
      } catch (e) {
         next(e);
      }
   };

   private resetPassword = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      try {
         const {password} = req.body;
         const user = (<IRequest> req).user
         const userServiceInstance = Container.get(UserService);
         const { message } = await userServiceInstance.resetPassword(user._id, password)
         res.status(200).json({ message });
      } catch (e) {
         next(e);
      }
   };

   private getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const user =  (<IRequest>req).user;
         res.status(200).json(user)
      } catch (e) {
         next(e);
      }
   }

}

export default UserController;
