const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr')
cryptr = new Cryptr('asdasdjasjdiasjdiasjdias')
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded._id;
        next();
    } catch{
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}
