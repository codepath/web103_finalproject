/* eslint-disable no-undef */
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import jwt from 'jsonwebtoken';

// command to create jwt secret key
// node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
const KEYLEN = 32;

const JWT_SECRET = process.env.JWT_SECRET

const hash = async (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");

    scrypt(password, salt, KEYLEN, (err, derivedKey) => {
      if (err) {
        reject(err);
      }

      //derivedKey is a Buffer
      const derivedHex = derivedKey.toString("hex");
      resolve(`${salt}:${derivedHex}`);
    });
  });
};

const compare = async (password, dbSaltHash) => {
  return new Promise((resolve, reject) => {
    const [salt, hash] = dbSaltHash.split(":");

    const hashBuffer = Buffer.from(hash, "hex");

    scrypt(password, salt, KEYLEN, (err, derivedKey) => {
      if (err) {
        reject(err);
      }

      const isEqual = timingSafeEqual(hashBuffer, derivedKey);
      resolve(isEqual);
    });
  });
};

//encrypt
const signToken = (user) => {
    try{
        return jwt.sign(user, JWT_SECRET, {expiresIn: '1h'});
    } catch (error){
        return error;
    }
};

//decrypt
const verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);
    } catch(error){
        return error;
    }
}

export { hash, compare, signToken, verifyToken};
