import {EDITED_CONTACT, FORM_MODE} from "./local-storage-constants.js";

const contact =  JSON.parse(localStorage.getItem(EDITED_CONTACT)).data || {};

const name = document.getElementById('contact-name');
const email = document.getElementById('contact-email');
const phone = document.getElementById('contact-phone');
const address = document.getElementById('contact-address');

console.log({name, email, phone, address, data: contact})
name.innerText = contact.name || '';
email.innerText = contact.email || '';
phone.innerText = contact.phoneNumber || '';
address.innerText = contact.address || '';