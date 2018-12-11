const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../helpers/user.model');
const AdminModel = require('../helpers/admin.model');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECRET;
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log('User Authenticating:', jwtPayload);
        UserModel.findUser({ _id: jwtPayload._id }, function (err, user) {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user[0]);
            }
            else {
                return done(null, false);
            }
        });
    }));
}