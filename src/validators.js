export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (isValid) return {
        valid: true,
        message: ''
    };

    return {
        valid: false,
        message: 'Por favor, ingrese un email válido'
    };
}

export function validatePassword(password) {
    if (password.length < 8) return {
        valid: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
    };

    if (password.length > 20) return {
        valid: false,
        message: 'La contraseña debe tener menos de 20 caracteres'
    };

    if (password.search(/\d/) === -1) return {
        valid: false,
        message: 'La contraseña debe tener al menos un número'
    };

    if (password.search(/[A-Z]/) === -1) return {
        valid: false,
        message: 'La contraseña debe tener al menos una letra mayúscula'
    };

    // must contain at least one special character
    if (password.search(/[^A-Za-z0-9]/) === -1) return {
        valid: false,
        message: 'La contraseña debe tener al menos un caracter especial (ej: !, @, #, ., etc)'
    };

    return {
        valid: true,
        message: ''
    };
}