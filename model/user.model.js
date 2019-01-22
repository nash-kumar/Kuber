const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    type: { type: [String], enum: ["native", "google", "facebook"], required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    userId: { type: [String], default: null },
    phoneNumber: { type: Number, default: null },
    profileImage: { type: String, default: null },
    role: { type: String, default: "user" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    location: { latitude: Number, longitude: Number },
    address: [{ type: Schema.Types.ObjectId, refer: 'addresses' }],
    recentlyViewedCharity: [{ type: Schema.Types.ObjectId, refer: 'users' }]//refer - collection Name
});
UserSchema.plugin(mongoosePaginate);
const UserModel = mongoose.model('users', UserSchema);
module.exports = { UserModel };