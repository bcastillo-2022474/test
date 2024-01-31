import {validateEmail, validatePassword, validateMinLength, validateTel, validateUser} from './validators.js';
import {resetUIOnSuccess, updateUIOnError, updateUiOnSuccess} from "./ui-states.js";

const inputsContainer = document.getElementById('inputs-container');
const loginButton = document.getElementById('login-button');




inputsContainer.addEventListener('blur', (e) => {
    const input = e.target.closest('input');
    if (!input) return;

    const isValid = validateInput(input);

    if (!isValid.valid && input.dataset.touched !== 'true') updateUIOnError(input, isValid.message)

    input.dataset.touched = 'true';
}, true);

inputsContainer.addEventListener('input', (e) => {
    const input = e.target.closest('input');
    if (!input) return;

    const isValid = validateInput(input);
    if (isValid.valid) {
        updateUiOnSuccess(input);
        return;
    }

    if (!isValid.valid && input.dataset.touched === 'true') updateUIOnError(input, isValid.message)
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

function checkBothPasswordMatch([mainPassword, repeatedPassword]) {
    // const mainPasswordValidation = validatePassword(mainPassword.value);
    // const areBothPasswordTheSame = mainPassword.value === repeatedPassword.value;
    // if (areBothPasswordTheSame) return mainPasswordValidation;
    //
    // if (!mainPasswordValidation.valid) return mainPasswordValidation
    //
    // return {
    //     valid: false,
    //     message: 'Las contraseñas no coinciden'
    // };

    return mainPassword.value === repeatedPassword.value;
}

function handleValidationForPassword(currentPasswordBeingTyped, {mainPassword, repeatedPassword}) {
    const areBothPasswordSame = checkBothPasswordMatch([mainPassword, repeatedPassword]);
    const mainPasswordValidation = validatePassword(mainPassword.value);
    if (currentPasswordBeingTyped === mainPassword) {
        if (!mainPasswordValidation.valid) return mainPasswordValidation;
        if (!areBothPasswordSame && repeatedPassword.dataset.touched !== 'true') return mainPasswordValidation;
        if (!areBothPasswordSame) {
            updateUIOnError(repeatedPassword, 'Las contraseñas no coinciden');
            return mainPasswordValidation;
        }

        // update UI of the other password input
        resetUIOnSuccess(repeatedPassword);
        return mainPasswordValidation;
    }

    // now we know that the current input being typed is the repeated password
    const repeatedPasswordValidation = validateRepeatedPassword([mainPassword, repeatedPassword], currentPasswordBeingTyped);
    if (!repeatedPasswordValidation.valid) return repeatedPasswordValidation;

    if (!mainPasswordValidation.valid) return mainPasswordValidation;

    // now we know that the repeated password is valid and so is the main password
    // basically updates the UI of the other password input
    resetUIOnSuccess(mainPassword)
    return repeatedPasswordValidation;
    // }
}

function validateInput(input) {
    const section = input.closest('section');
    const isPersonalInfoSection = section.id === 'personal-info';
    if (isPersonalInfoSection) {
        if (input.type === 'text') return validateMinLength(3, input.value);
        if (input.type === 'tel') return validateTel(input.value);
    }
    if (input.type === 'email') return validateEmail(input.value);
    // user validation
    if (input.type === 'text') return validateUser(input.value);

    const [mainPassword, repeatedPassword] = [...section.querySelectorAll('input[type="password"]')];
    if (input.type === 'password') return handleValidationForPassword(input, {mainPassword, repeatedPassword});
}


