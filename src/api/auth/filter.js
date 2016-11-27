export default (client) => {
    return (req, res, next) => {
        console.info(client);
        return next();
    }
}