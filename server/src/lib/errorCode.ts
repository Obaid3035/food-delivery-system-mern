class GeneralError extends Error {
    message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }


    getErrorCode() {
        if (this instanceof BadRequest) {
            return 400;
        } if (this instanceof NotFound) {
            return 404;
        } if (this instanceof UnAuthorized) {
            return 401;
        } if (this instanceof Forbidden) {
            return 403;
        } if (this instanceof Gone) {
            return 410;
        }

        return 500;
    }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class UnAuthorized extends GeneralError {}
class Forbidden extends GeneralError {}
class Gone extends GeneralError {}

export {GeneralError as default, BadRequest, NotFound, UnAuthorized, Forbidden, Gone};
