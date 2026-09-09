import bcrypt from 'bcrypt';

//num de rondas de encriptacion, 10 es estandar de seguridad/rendimiento
const SALT_ROUNDS = 10;

// hasheo el pass
export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};

// comparo un pass en texto plano con en hash guardado en db
export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};