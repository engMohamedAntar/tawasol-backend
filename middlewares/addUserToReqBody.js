module.exports = (req, res, next) => {
    req.body.user = req.user.id;
    next();
};