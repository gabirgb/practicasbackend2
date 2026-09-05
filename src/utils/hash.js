import bcrypt from 'bcrypt';

// Asincrónico
export const createHashedPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePass = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};