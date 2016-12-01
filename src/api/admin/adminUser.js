import { Router } from 'express';
// import jwtSimple from 'jwt-simple';
import jwt from 'jsonwebtoken';
import secret from '../../config/secret';
import { expireToken, saveToken, removeToken, TOKEN_EXPIRATION } from '../../config/token_manager';

let adminLogin = (config, db, User) => {
    let router = Router();

    router.post("/login", (req, res, next) => {
        // let tokenArr = req.session.userTokenArr;
        let data = req.body;
        let ret;
        (async function () {
            let userInfo = await User.findOne({
                'where': { 'name': data.name }
            });
            if (userInfo) {
                if (userInfo.pwd === data.pwd) {
                    let token = jwt.sign({ id: userInfo.id }, secret, { expiresIn: TOKEN_EXPIRATION })
                    let finalToken = userInfo.id + " " + token;
                    saveToken(token);
                    ret = { success: true, token: finalToken, userName: userInfo.name };
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
        (async function () {
            let affectedRowCount = await removeToken(req.headers);
            let ret = false;
            if (affectedRowCount === 1) {
                ret = true;
            }
            res.json({ success: ret });
        })()
    });

    return router;
}

export default adminLogin;