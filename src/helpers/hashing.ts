import { hash } from "crypto";

const bcrypt = require('bcrypt');


// encrypting password
export async function encryptPassword(plainText: string): Promise<string>{
    try {
        const hashedPassword = await bcrypt.hash(plainText, 10);
        return hashedPassword;
    }
    catch (error) {
        throw new Error("Error encrypting password");
    }
}

// decrypting password
export async function comparePasswords(plainText: string, hashedPass: string): Promise<string>{
    try {
        return await bcrypt.compare(plainText, hashedPass);
    }
    catch (error) {
        throw new Error("Error encrypting password");
    }
}





// debug functions
async function testEncryption() {
    try {
        const encryptedPassword = await encryptPassword("test");
        console.log(encryptedPassword);  // Logs the hashed password after the promise resolves
    } catch (error) {
        console.error("Error encrypting password:", error);
    }
}

async function testCompare() {
    try {
        const bool = await comparePasswords("passwrd", "$2b$10$YPHWaJf5tlW.BtUoVHDDxOMGfXV3FPNshUuNAUE5Izan6DXvcyec.");
        console.log(bool);  // Logs the hashed password after the promise resolves
    } catch (error) {
        console.error("Error encrypting password:", error);
    }
}

// testEncryption();
// testCompare();