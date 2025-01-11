import { default as Csrf } from 'csrf';

const csrf = new Csrf(); // Membuat instance CSRF

const secret = process.env.CSRF_SECRET || 'defaultSecret'; // Pastikan secret disimpan di .env

export const generateCsrfToken = () => {
    return csrf.create(secret); // Generate token berdasarkan secret
};

export const verifyCsrfToken = (token) => {
    return csrf.verify(secret, token); // Verifikasi token dengan secret
};
