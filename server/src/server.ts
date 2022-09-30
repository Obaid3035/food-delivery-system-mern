import App from "./app";
import OrderController from './controller/vendor/order.controller';
import DashboardController from './controller/vendor/dashboard.controller';
import ProductController from './controller/vendor/product.controller';
import ShopController from './controller/vendor/shop.controller';
import UserController from './controller/user.controller';
import AddOnController from './controller/vendor/addOn.controller';
import CategoryController from './controller/vendor/category.controller';
import MenuTypeController from './controller/vendor/menuType.controller';
import GalleryController from "./controller/vendor/gallery.controller";
import CustomerShopController from "./controller/customer/shop.controller"
import ReviewController from "./controller/vendor/review.controller";
import CustomerOrderController from "./controller/customer/order.controller";
import CustomerReviewController from "./controller/customer/review.controller";
import VendorController from "./controller/admin/vendor.controller";
import CustomerController from "./controller/admin/customer.controller";
import StripeController from "./controller/vendor/stripe.controller";
import AdminOrderController from "./controller/admin/order.controller";
import SubscriptionController from "./controller/vendor/subscription.controller";
import AdminDashboardController from "./controller/admin/dashboard.controller";

const vendorControllers = [
    new DashboardController(),
    new ProductController(),
    new ShopController(),
    new AddOnController(),
    new CategoryController(),
    new MenuTypeController(),
    new GalleryController(),
    new ReviewController(),
    new DashboardController(),
    new StripeController(),
    new SubscriptionController()
]

const adminControllers = [
    new VendorController(),
    new CustomerController(),
    new AdminOrderController(),
    new AdminDashboardController()
]


const app = new App([
    new UserController(),
    new OrderController(),
    new CustomerShopController(),
    new CustomerOrderController(),
    new CustomerReviewController(),
    ...vendorControllers,
    ...adminControllers
]);

app.listenAndInitializeDatabase();



