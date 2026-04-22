import bcrypt from 'bcrypt';

const hashRound = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, hashRound);
}

export async function compareHashed(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
}