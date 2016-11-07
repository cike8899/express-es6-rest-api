let initTokenArr = (req, res, next) => {
    let session = req.session;
    if (!session.userTokenArr) {
        session.userTokenArr = [];
    }
    return next();
}

export default initTokenArr;