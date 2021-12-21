class BaseController {
    constructor() {

    }

    responseSuccess = (res, data) => {
        return res.status(200).send({
            statusCode: 200,
            data
        });
    }

    responseError = (res, message, code = 500) => {
        return res.status(code).send({
            status: code,
            message: message
        });
    }
}

export default BaseController;