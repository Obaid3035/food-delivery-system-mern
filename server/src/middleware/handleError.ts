import GeneralError from '../lib/errorCode';
import {NextFunction, Request, Response} from "express";

const handleError = (err: Error, _req: Request , res: Response, _next: NextFunction) => {

    if (err instanceof GeneralError) {
        return res.status(err.getErrorCode()).json({
            status: 'Error',
            message: err.message,
        });
    }

    return res.status(500).json({
        status: 'Error',
        message: err.message,
    });
};

export default handleError;
