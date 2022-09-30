import express, {Application} from 'express';
import mongoose from "mongoose";
import 'reflect-metadata';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import handleError from "./middleware/handleError";
import {IController} from "./interface";

class App {
    public app: Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.initializeMiddleware();
        this.initializeController(controllers);
        this.initializeErrorHandler();
    }

    public listenAndInitializeDatabase() {
        const uri: string = process.env.MONGODB_URL!;
        mongoose.connect(uri, (err) => {
            if (!err) {
                this.app.listen(process.env.PORT, () => {
                    console.log('Server is listening on port 4000');
                })
            } else {
                console.log(err)
            }
        })

    }

    private initializeMiddleware() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(
           rateLimit({
               windowMs: 15 * 60 * 1000,
               max: 25000,
           }),
        );
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}))
    }

    private initializeController(controllers: IController[]) {
        controllers.forEach(controller => {
            this.app.use(controller.router)
        })
    }

    private initializeErrorHandler() {
        this.app.use(handleError);
    }
}

export default App;
