const UserModel = require('../helpers/user.model');
const AdminModel = require('../helpers/admin.model')
    const Validators = require('../helpers/validators');
const bcrypt = require('bcrypt');

function signup(data, role, callback) {
    if (role === "admin") model = AdminModel;
    else model = UserModel;
    //Native Signup
    if (data.email && data.password && data.type === 'native') {
        Validators.hashPassword(data.password, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.password = hash;
                model.findUser({ email: data.email, type: { $nin: [data.type] } }, (err, user) => {
                    if (err) callback(err, null);
                    else if (user) {
                        data.$push = { type: data.type }
                        delete data.type;
                        model.findUserAndUpdate({ _id: user[0]._id }, data, (err, res) => {
                            if (err) callback(err, null);
                            else if (res) {
                                callback(null, res);
                            }
                            else callback(null, null);
                        });
                    }
                    else model.signup(data, callback);
                });
            } else callback(null, null);
        });
    }

    //Social Signup
    else if (data.type === 'facebook' || data.type === 'google' && data.userId) {
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
                                else {
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
                            });
                        } else {
                            data.userId = hash;
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
                    } else {
                        data.userId = hash;
                        model.signup(data, callback);
                    }
                });
            } else callback(null, null)
        });
    } else callback(null, null);
}

function login(data, role, callback) {
    if (role === "admin") model = AdminModel;
    else model = UserModel;
    if (data.email && data.password) {
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

    } else if (data.email && data.userId) {
        model.login({ email: data.email }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {
                bcrypt.compare(data.userId, res.userId[0], (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else bcrypt.compare(data.userId, res.userId[1], (err, same) => {
                        if (err) callback(err, null);
                        else if (same) {
                            Validators.generateJWTToken(res._id, callback);
                        } else callback(null, null);
                    })
                });
            }
            else callback(null, null);
        })
    } else callback(null, null);
}


module.exports = { signup, login }