const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.status(400).send({error: "Provide access token"})
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decode.userId;
    next()
}