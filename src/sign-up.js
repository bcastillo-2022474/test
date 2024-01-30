import {validateEmail, validatePassword, validateMinLength, validateTel, validateUser} from './validators.js';

const inputsContainer = document.getElementById('inputs-container');
const loginButton = document.getElementById('login-button');

inputsContainer.addEventListener('blur', (e) => {
    const input = e.target.closest('input');
    if (!input) return;

    const isValid = validateInput(input);

    if (!isValid.valid && input.dataset.touched !== 'true') {
        input.classList.add('touched');
        input.nextElementSibling.textContent = isValid.message;
        input.nextElementSibling.classList.toggle('hidden');
        input.dataset.valid = 'false';
    }
    input.dataset.touched = 'true';
}, true);

inputsContainer.addEventListener('input', (e) => {
    const input = e.target.closest('input');
    if (!input) return;

    const isValid = validateInput(input);
    if (isValid.valid) {
        input.classList.remove('touched');
        input.nextElementSibling.classList.add('hidden');
        input.dataset.valid = 'true'
        return;
    }

    if (!isValid.valid && input.dataset.touched === 'true') {
        input.classList.add('touched');
        input.nextElementSibling.classList.remove('hidden');
        input.nextElementSibling.textContent = isValid.message;
        input.dataset.valid = 'false';
    }
})

function validateRepeatedPassword([mainPassword, repeatedPassword], currentInputBeingTyped) {
    const areBothPasswordTouched = mainPassword.dataset.touched === 'true' && repeatedPassword.dataset.touched === 'true';
    const isRepeatedPassword = currentInputBeingTyped === repeatedPassword;
    if (mainPassword.value !== repeatedPassword.value && (areBothPasswordTouched || isRepeatedPassword)) return {
        valid: false,
        message: 'Las contraseñas no coinciden'
    };

    return {
        valid: true,
        message: ''
    };
}

function validatePasswordAndCheckMatchesRepeatedPassword([mainPassword, repeatedPassword]) {
    const isMainPassword = validatePassword(mainPassword.value);
    const areBothPasswordTheSame = mainPassword.value === repeatedPassword.value;
    if (areBothPasswordTheSame) return isMainPassword;

    if (!isMainPassword.valid) return isMainPassword

    return {
        valid: false,
        message: 'Las contraseñas no coinciden'
    };
}

function validateInput(input) {
    const section = input.closest('section');
    const isPersonalInfoSection = section.id === 'personal-info';
    if (isPersonalInfoSection) {
        if (input.type === 'text') return validateMinLength(3, input.value);
        if (input.type === 'tel') return validateTel(input.value);
    }
    if (input.type === 'email') return validateEmail(input.value);
    if (input.type === 'password') {

        const [mainPassword, repeatedPassword] = [...section.querySelectorAll('input[type="password"]')];
        if (input === mainPassword) {
            const validity = validatePasswordAndCheckMatchesRepeatedPassword([mainPassword, repeatedPassword]);
            if (!validity.valid) return validity;

            // update UI of the other password input
            repeatedPassword.classList.remove('touched');
            repeatedPassword.nextElementSibling.classList.add('hidden');
            repeatedPassword.nextElementSibling.textContent = '';
            repeatedPassword.dataset.valid = 'true';
            return validity;
        }

        const isRepeatedPassword = validateRepeatedPassword([mainPassword, repeatedPassword], input);
        if (!isRepeatedPassword.valid) return isRepeatedPassword;

        const isMainPassword = validatePassword(mainPassword.value);
        if (!isMainPassword.valid) return isMainPassword;


        if (mainPassword.nextElementSibling.textContent.toLowerCase().includes('contraseñas no coinciden') && mainPassword.dataset.touched === 'true') {

            // basically updates the UI of the other password input
            mainPassword.classList.remove('touched');
            mainPassword.nextElementSibling.classList.add('hidden');
            mainPassword.nextElementSibling.textContent = '';
            mainPassword.dataset.valid = 'true';
            return isRepeatedPassword;
        }
    }
    // user validation
    if (input.type === 'text') return validateUser(input.value);
}


