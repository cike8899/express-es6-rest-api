import { Router } from 'express';
import jwtSimple from 'jwt-simple';

let adminLogin = (config, db, User) => {
    let router = Router();

    router.post("/login", (req, res, next) => {
        let tokenArr = req.session.userTokenArr;
        let data = req.body;
        let ret;
        (async function () {
            let userInfo = await User.findOne({
                'where': { 'name': data.name }
            });
            if (userInfo) {
                if (userInfo.pwd === data.pwd) {
                    let payload = { foo: 'bar' };
                    let secret = 'xxx';
                    let token;
                    if (!tokenArr.some(x => x.userName === userInfo.name)) {
                        token = jwtSimple.encode(payload, secret);
                        tokenArr.push({ token: token, userName: userInfo.name });
                    } else {
                        token = tokenArr.filter(x => x.userName === userInfo.name)[0].token;
                    }
                    ret = { success: true, token: token, userName: userInfo.name };
                } else {
                    ret = { success: false, token: "", userName: userInfo.name };
                }
            } else {
                ret = { success: "not found", token: "" };
            }
            return res.json(ret);
        })()
    });

    router.post("/logout", (req, res, next) => {//销毁session中的token
        let currentUserToken = req.headers.authorization;
        let tokenArr = req.session.userTokenArr;
        let adaptiveTokenArr = tokenArr.filter(x => (x.userName === req.body.name) && (x.token === currentUserToken));
        let ret;
        if (adaptiveTokenArr && adaptiveTokenArr[0]) {
            let tokenObj = adaptiveTokenArr[0];
            let idx = tokenArr.indexOf(tokenObj);
            tokenArr.splice(idx, 1);
            ret = { success: true };
        } else {
            ret = { success: false };
        }
        res.json(ret);
    });

    return router;
}

export default adminLogin;