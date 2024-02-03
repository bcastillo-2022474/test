import {validateEmail, validateMinLength, validateTel} from './validators.js';
import {resetUIOnSuccess, updateUIOnError, updateUiOnSuccess} from "./ui-states.js";
import {CONTACTOS, EDITED_CONTACT, FORM_MODE} from "./local-storage-constants.js";


// check local storage
const {mode} = JSON.parse(localStorage.getItem(FORM_MODE)) || {};
console.log({mode})
const submitButton = document.getElementById('submit-button');
const titleForm = document.getElementById('title-form');
const inputsContainer = submitButton.closest('#inputs-container');

function validateInput(input) {
    if (input.type === 'email') return validateEmail(input.value);
    if (input.type === 'tel') return validateTel(input.value);
    if (input.type === 'text') {
        if (input.id === 'name') return validateMinLength(3, input.value);
        if (input.id === 'address') return validateMinLength(5, input.value);
    }
}


inputsContainer.addEventListener('blur', (e) => {
    const input = e.target.closest('input');
    if (!input || input.type === 'checkbox') return;

    const validator = validateInput(input);

    if (!validator.valid && input.dataset.touched !== 'true') updateUIOnError(input, validator.message)

    input.dataset.touched = 'true';
}, true);

inputsContainer.addEventListener('input', (e) => {
    const input = e.target.closest('input');
    if (!input || input.type === 'checkbox') return;

    const validator = validateInput(input);
    console.log(validator.valid)
    if (validator.valid) {
        updateUiOnSuccess(input);
        return;
    }

    if (!validator.valid && input.dataset.touched === 'true') updateUIOnError(input, validator.message)
})

const gatherContactData = (form) => {
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const phoneNumber = form.querySelector('input[name="phoneNumber"]').value;
    const address = form.querySelector('input[name="address"]').value;
    const favorite = form.querySelector('input[name="favorite"]').checked;
    return {
        name,
        email,
        phoneNumber,
        address,
        favorite
    }
}

if (mode === 'create' || !mode) {
    // create contact
    // change title
    titleForm.textContent = 'Crear contacto';

    // change button text
    submitButton.textContent = 'Guardar';

    // save new contact
    submitButton.addEventListener('click', (e) => {
        const form = e.target.closest('form');
        e.preventDefault();
        const contact = gatherContactData(form);
        localStorage.setItem(CONTACTOS, JSON.stringify([...JSON.parse(localStorage.getItem(CONTACTOS) || '[]'), contact]));

        console.log('SAVED CONTACT IN LOCAL STORAGE')

        // reset form
        form.querySelector('input[name="name"]').value = '';
        form.querySelector('input[name="email"]').value = '';
        form.querySelector('input[name="phoneNumber"]').value = '';
        form.querySelector('input[name="address"]').value = '';
        form.querySelector('input[name="favorite"]').checked = false;
    });
}

if (mode === 'edit') {
    // edit contact
    // change title
    titleForm.textContent = 'Editar contacto';
    // change button text
    submitButton.textContent = 'Actualizar';
    const contact = JSON.parse(localStorage.getItem(EDITED_CONTACT)).data;
    // fill the form with the data
    const form = submitButton.closest('form');
    form.querySelector('input[name="name"]').value = contact.name;
    form.querySelector('input[name="email"]').value = contact.email;
    form.querySelector('input[name="phoneNumber"]').value = contact.phoneNumber;
    form.querySelector('input[name="address"]').value = contact.address;
    form.querySelector('input[name="favorite"]').checked = contact.favorite;

    // add event listener to submit button
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const contact = gatherContactData(form);
        const index = JSON.parse(localStorage.getItem(EDITED_CONTACT)).index;
        const contacts = JSON.parse(localStorage.getItem(CONTACTOS) || '[]');
        contacts[index] = contact;
        localStorage.setItem(CONTACTOS, JSON.stringify(contacts));

        // redirect to contact page
        location.href = './contacts.html';
    });
}