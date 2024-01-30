import {validateEmail, validateForm, validateMinLength, validatePassword} from './validators.js';

const inputsContainer = document.getElementById('inputs-container');
const loginButton = document.getElementById('login-button');

inputsContainer.addEventListener('blur', (e) => {
    const input = e.target.closest('input');
    if (!input) return;

    // touched
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

function validateInput(input) {
    if (input.type === 'email') return validateEmail(input.value);
    if (input.type === 'password') return validatePassword(input.value);
}

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formIsValid = validateForm([...inputsContainer.querySelectorAll('input')]);
    if (!formIsValid) return;
})
