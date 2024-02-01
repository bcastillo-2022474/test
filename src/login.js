import {validateEmail, validateForm, validatePassword} from './validators.js';
import {ALL_USERS, LOGGED_USER} from "./local-storage-constants.js";

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

const users = JSON.parse(localStorage.getItem(ALL_USERS)) || [];
    const userForm = {
        email: inputsContainer.querySelector('input[type="text"]').value,
        password: inputsContainer.querySelector('input[type="password"]').value
    }

    const user = users.find(user => user.email === userForm.email && user.password === userForm.password);
    if (!user) {
        // update UI
        return;
    }

    localStorage.setItem(LOGGED_USER, JSON.stringify({
        email: inputsContainer.querySelector('input[type="text"]').value,
        password: inputsContainer.querySelector('input[email="password"]').value
    }));
    location.href = './contact-page.html';
})
