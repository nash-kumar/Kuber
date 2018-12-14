const UserModel = require('../helpers/user.model');
const AdminModel = require('../helpers/admin.model')
const Validators = require('../helpers/validators');
const bcrypt = require('bcrypt');

function signup(data, role, callback) {
    if (role === "admin") model = AdminModel;
    else model = UserModel;
    //Native Signup
    if (data.type === "native" && data.password) {
        Validators.hashPassword(data.password, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.password = hash;
                if (role === "admin") model = AdminModel;
                else model = UserModel;
                model.findUser({ email: data.email, type: { $nin: [data.type] } }, (err, user) => {
                    if (err) callback(err, null);
                    else if (user) toPush();
                    else model.signup(data, callback);
                });
            } else callback(null, null);
        });
    }

    //Social Signup
    else if (data.type === "google" || data.type === "facebook" && data.userId) {
        Validators.hashPassword(data.userId, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                model.findUser({ email: data.email, type: { $nin: [data.type] } }, (err, reg) => {
                    if (err) callback(err, null);
                    else if (reg) {
                        if (reg[0].userId.length > 0) {
                            bcrypt.compare(data.userId, reg[0].userId[0] || reg[0].userId[1], (err, same) => {
                                data.userId = hash;
                                if (err) callback(err, null);
                                else if (same) callback(null, null)
                                else toPush();
                            });
                        } else toPush();
                    } else model.signup(data, callback);
                });
            } else callback(null, null)
        });
    } else callback(null, null);
}

function login(data, role, callback) {
    if (role === "admin") model = AdminModel;
    else model = UserModel;
    if (data.email && data.password && data.type === "native") {
        model.login({ email: data.email }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {
                console.log('THE RESPONSCE:', res);
                bcrypt.compare(data.password, res.password, (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else callback(null, null);
                });
            } else callback(null, null);
        });
    } else if (data.type === "google" || data.type === "facebook" && data.userId) {
        model.login({ email: data.email, type: { $in: [data.type] } }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {
                bcrypt.compare(data.userId, res.userId[0] || res.userId[1], (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else callback(null, null);
                });
            }
            else callback(null, null);
        })
    } else callback(null, null);
}

function toPush() {
    data.$push = { userId: data.userId, type: data.type }
    delete data.type;
    delete data.userId;
    model.findUserAndUpdate({ _id: reg[0]._id }, data, (err, res) => {
        if (err) callback(err, null);
        else if (res) {
            callback(null, res);
        }
        else callback(null, null);
    });
}
 
module.exports = { signup, login }