// ~ to be imported in app.js

import jwt from 'jsonwebtoken'
import bcrypt from'bcrypt'
import 'dotenv/config'

// simply creates a jwt token
export const createJWT = () => {
    return new Promise((resolve, reject) => {
        jwt.sign(process.env.JWT_SECRET, (err, token) => {
            if(err){
                return reject(err)
            }
                return resolve(token)
                // the above code should have been converted to string;
                // the method was token as string bur returned error : Type assertion expressions can only be used in TypeScript files
        })
    })
}
// does hashing a comparing passwords in a single function
export const comparePassword = (plainText, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hash, (err, result) => {
            if (err) {
                return reject(err)
            }

            return resolve(result)
        })
    })
}
