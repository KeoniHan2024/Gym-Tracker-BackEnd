import { queryDatabase } from "../config/db";
import { User } from "../models/User";
import { encryptPassword, comparePasswords } from "../helpers/hashing";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET as string;

export async function createUser(user: User){
    const { first_name,  email, password } = user;

    try {
        const existingUser =  await queryDatabase("SELECT * FROM users where email = ?", [email]);

        if (existingUser.length > 0) {
            throw new Error("Email is already taken");
        } 

        const hashedPassword = await encryptPassword(password);
        const result = await queryDatabase("INSERT INTO users (first_name, email, password) VALUES (?,?,?)", [first_name, email, hashedPassword]);

        return {
            id: result.insertId, first_name, email
        };
    }
    catch(error: any) {
        if (error.code) {
            console.error(`MySQL Error - Code: ${error.code}, Message: ${error.message}`);
        }
        else {
            // If it's a general error, log it
            console.error(`Error: ${error.message}`);
        }
        throw error;
    }
}

export async function verifyLogin(email: string, password:string ) {
    // find the hashed version of email's password
    const userList = await queryDatabase("SELECT * FROM users WHERE email = ?", [email]);
    const user = userList[0];
    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
        throw new Error("Invalid email or password"); // Wrong password
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { userid: user.user_id, email: user.email }, 
        SECRET_KEY, 
        {expiresIn: "1h"}
        );
    return { token, user }; // Return token and user details
}

