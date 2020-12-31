import { genSaltSync, hashSync } from 'bcrypt';

// /** Function that generates the password hash. */
export function encryptPassword(password: string): string {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
}
