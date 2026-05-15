import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string, saltValue: number = 10) => {
    return bcrypt.hash(password, saltValue);
}

export const hashResetCode = (code: string | number , saltValue: number = 12) => {
    return bcrypt.hash(String(code), saltValue);
}

export const comparePassword = (password: string, exisingPassword: string) => {
    return bcrypt.compare(password, exisingPassword);
}
export const compareHash = (password: string, exisingPassword: string) => {
    return bcrypt.compare(password, exisingPassword);
}