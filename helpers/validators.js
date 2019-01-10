const bcrypt = require('bcrypt');
const rounds = 10;
const atob = require('atob');
const SECRET = process.env.SECRET;
const crypto = require('crypto');
let b64ToString;
let creds = [];
const jwt = require('jsonwebtoken');

function encrypt(data, key) {
    let ciphar = crypto.createCipheriv("aes-128-ecb", key, "");
    ciphar.setAutoPadding(false);
    data = padRightToMod(data, 32, "");
    ciphar.on("readable", () => {
        let data = ciphar.read();
        if (data) {
            encrypt += data.toString("hex");
        }
    });
    let encrypted = ciphar.update(data, "utf8", "hex");
    encrypted += ciphar.final("hex");
    return encrypted;
    function padRightToMod(text, mod, pad) {
        if (mod < 0) {
            return text;
        }
        text = text || "";
        pad = pad || " ";
        let len = text.length;
        let r = text;
        for (let i = len; i % mod > 0; i++) {
            r += pad;
        }
        return r;
    }

}

function decrypt(data ,key) {
    // let key = new Buffer.from(hexKey, "hex");
    let decipher = crypto.createDecipheriv("aes-128-ecb", key, "");
    decipher.setAutoPadding(false);
    decipher.on("readable", () => {
        let data = decipher.read();
        if (data) {
            decrypt += data.toString("utf8");
        }
    });
   let plainText = decipher.update(data, "hex", "utf8");
    decipher.final();
    return plainText.trim();
}

function validateMobileNo(number) {
    if (number && (number.toString()).length > 6 && (number.toString()).length < 11) return true;
    else return false;
    return false;
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function hashPassword(password, callback) {
    bcrypt.hash(password, rounds, function (err, hash) {
        if (err) {
            console.error('Error while hashing the password', rounds, password, err, hash);
            callback(err, null);
        } else if (hash) {
            console.info('Hash Successfully Created');
            callback(null, hash);
        } else callback(null, null);
    });
}
function decodeAuthString(authString, callback) {
    b64ToString = atob(authString);
    creds = b64ToString.split(':');
    if (creds && creds.length === 2) callback(creds[0], creds[1]);
    else callback(null, null);
}

function generateJWTToken(id, callback) {
    // Extracting Id and converting to string representation 
    /* let id = new ObjectId(id);
    id = id.toHexString(); */
    const payload = { _id: id };
    console.log('The Hex Id String:', payload);
    let token = jwt.sign(payload, SECRET, {
        expiresIn: 604800 * 4 //4 week 
    });
    token = 'JWT ' + token;
    console.info('Successfully created an access token', id, token);
    callback(null, token);
}

module.exports = { encrypt, decrypt, validateMobileNo, validateEmail, hashPassword, decodeAuthString, generateJWTToken }
