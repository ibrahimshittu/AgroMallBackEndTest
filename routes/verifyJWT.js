const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]
   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({
                message: 'Invalid token'
            });
        } else {
            req.user = user;
            next();
        }
    });
    
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyJWT(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({
                message: 'Forbidden'
            });
        }
    });

}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyJWT(req, res, () => {
        
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({
                "message": 'You are not allowed to do that!'
            });
        }
    });

}

module.exports = {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyJWT};