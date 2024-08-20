import crypto from 'crypto';

const generateSalt = (rounds: number = 12): string => {
    if (rounds > 15) {
        throw new Error(`rounds must be >15, rounds: ${rounds}.`);
    }
    if (typeof rounds !== 'number') {
        throw new Error('Rounds parameter must be a number.');
    }

    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
};

// hash a password with a salt
const hasher = (password: string, salt: string): { salt: string, hashedPassword: string } => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        hashedPassword: value
    };
};

// hash a password with a newly generated salt
const hash = (password: string): { salt: string, hashedPassword: string } => {
    const salt = generateSalt(10);
    if (!password || !salt) {
        throw new Error(`Must provide both password and salt values.`)
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('Password and salt must both be a string.');
    }
    return hasher(password, salt);
};

const compare = (password: string, hashData: { salt: string, hashedPassword: string }): boolean => {
    if (!password || !hashData) {
        throw new Error('Password and hash data are required to compare.');
    }
    if (typeof password !== 'string' || typeof hashData !== 'object') {
        throw new Error('Password must be a string and hash data must be an object.');
    }

    const passwordData = hasher(password, hashData.salt);
    return passwordData.hashedPassword === hashData.hashedPassword;
};

export {
    generateSalt,
    hash,
    compare
}
