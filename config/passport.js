const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    UserModel = require('../helpers/user.model'),
    AdminModel = require('../helpers/admin.model'),
    passport = require('passport');

module.exports = function (passportt) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECRET;
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log('User Authenticating:', jwtPayload);
        // if (user[0].role === "admin") model = AdminModel;
        // else model = UserModel;
        UserModel.findUser({ _id: jwtPayload._id, role: {$eq : ["role", 'user']}}, function (err, user) {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user[0]);
            }
            else {
                AdminModel.findUser({ _id: jwtPayload._id }, function (err, user) {
                    if (err) {
                        return done(err, false);
                    } else if (user) {
                        return done(null, user[0]);
                    }
                    else {
                        return done(null, false);
                    }
                });
            }
        });
        
    }));
}