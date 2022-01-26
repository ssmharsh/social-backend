const jwt = require('jsonwebtoken');

exports.generateToken = (userid) => {
    // Validate User Here
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: userid,
    }
  
    const token = jwt.sign(data, jwtSecretKey);
  
    return token;
};
  
// Verification of JWT
exports.validateToken = (req, res, next) => {

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let output;
    const bearerHeader = req.header('authorization');
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    jwt.verify(token, jwtSecretKey, function(err,user){
        if (err || !user) {
            output = {
                statusCode: 401,
                error: "Invalid Token",
            };
            } else {
                
                req.userId = user.userId;
                
                output = {
                    statusCode: 200,
                    user,
                };
            }
        });
        if (output.statusCode == 200) {
            next();
        } else {
            res.status(403).send({
            error: "Unauthorized",
            });
        }
        return output;
};



