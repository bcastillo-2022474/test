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

export function validateMinLength(minLength, text) {
    if (text.length < minLength) return {
        valid: false,
        message: `El campo debe tener al menos ${minLength} caracteres`
    };

    return {
        valid: true,
        message: ''
    };
}

export function validateForm(inputs) {
    const formIsValid = inputs.reduce((isValid, input) => {
        if (input.dataset.valid === 'false' || !isValid) return false;
        return true;
    }, true);

    return formIsValid;
}

export function validateTel(tel) {
    const telRegex = /^\d{8}$/;
    const isValid = telRegex.test(tel);
    if (tel.includes('+')) return {
        valid: false,
        message: 'Por favor, no incluya el código de país'
    };

    if (tel.includes('-')) return {
        valid: false,
        message: 'Por favor, no incluya guiones'
    }

    if (tel.trim().includes(' ')) return {
        valid: false,
        message: 'Por favor, no incluya espacios'
    }


    if (!isValid) return {
        valid: false,
        message: 'Por favor, ingrese un número de teléfono válido'
    };

    return {
        valid: true,
        message: ''
    };
}

// Validate user
export function validateUser(userName) {
    if (userName.length < 3) return {
        valid: false,
        message: 'El nombre de usuario debe tener al menos 3 caracteres'
    };

    if (userName.length > 20) return {
        valid: false,
        message: 'El nombre de usuario debe tener menos de 20 caracteres'
    };

    // must contain at least one special character
    if (userName.search(/[^A-Za-z0-9]/) !== -1) return {
        valid: false,
        message: 'El nombre de usuario debe contener caracteres especiales'
    };

    // must contain at least one number
    if (userName.search(/\d/) === -1) return {
        valid: false,
        message: 'El nombre de usuario debe contener al menos un número'
    };

    return {
        valid: true,
        message: ''
    };


}