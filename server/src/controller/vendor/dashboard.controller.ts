import { IController, IRequest } from '../../interface';
import { Request, Router, Response, NextFunction } from 'express';
import auth from '../../middleware/auth';
import { Container } from 'typedi';
import DashboardService from '../../service/vendor/DashboardService';
import {USER_ROLE} from "../../model/user";

class DashboardController implements IController {
   path = '/vendor/dashboard';
   router = Router();

   constructor() {
      this.router.get(`${this.path}`, auth(USER_ROLE.VENDOR), this.dashboard);
   }

   private dashboard = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      try {
         const shop = (<IRequest>req).user.shop;
         const dashboardServiceInstance = Container.get(DashboardService);
         const {
            dailySales,
            weeklySales,
            monthlySales,
            dailyOrderCount,
            pendingOrdersCount,
            completedOrdersCount,
            formattedLatestOrder,
            latestOrdersCount
         } = await dashboardServiceInstance.Sales(shop.toString());
         res.status(200).json({
            dailySales,
            weeklySales,
            monthlySales,
            dailyOrderCount,
            pendingOrdersCount,
            completedOrdersCount,
            recentOrders: {
               data: formattedLatestOrder,
               count: latestOrdersCount
            }
         });
      } catch (e) {
         next(e);
      }
   };
}

export default DashboardController;
