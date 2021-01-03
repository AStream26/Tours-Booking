class AppError extends Error{
    constructor(message,statuscode){
        super(message);
        this.statusCode = statuscode;
        this.status = `${statuscode}`.startsWith('s')?'Fail':'Error';
        this.isoperational  = true;
        Error.captureStackTrace = (this,this.constructor);
    }
}

module.exports = AppError;