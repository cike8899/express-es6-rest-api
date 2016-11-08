import session from 'express-session';

let authFunc = (router) => {
    let auth = function (req, res, next) {
        //鉴定用户  
        //如果鉴定失败，则调用next(new Error('Not authorized'));  
        //或者res.send(401);  
        console.info(req);
        let currentUserToken = req.headers.authorization;
        let session = req.session;
        // if (!session.userTokenArr) {
        //     session.userTokenArr = [];
        // }

        let tokenArr = req.session.userTokenArr;
        let isExist = false;
        for (let x of tokenArr) {
            if (x.token === currentUserToken) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            return next();
        } else {
            res.sendStatus(401);
        }


    }
    return auth;
}

export default authFunc;