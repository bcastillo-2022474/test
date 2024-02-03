import {getHighlightedRows} from "./highlighted-text.js";
import {getMatchingRows} from "./matching-rows.js";
import {CONTACTOS, EDITED_CONTACT, FORM_MODE, LOGGED_USER} from "../local-storage-constants.js";

import {
    hiddenFields,
    MAX_ROWS_SHOWED_PER_PAGE,
    searchInput,
    sorting,
    state,
    tableHeader, tbody
} from "./constants.js";

if (!localStorage.getItem(LOGGED_USER)) {
    location.href = './';
}


if (!localStorage.getItem(CONTACTOS)) {
    for (let i = 1; i <= 20; i++) {
        const contact = {
            name: `User ${i}`,
            email: `user${i}@example.com`,
            phoneNumber: `${Math.round(Math.random() * 100000000)}`.padEnd(8, '0'),
            address: '1234 Main St',
            favorite: Math.random() > 0.5
        }
        state.dataWithSpecialFilters.push(contact);
        state.baseData.push(contact);
    }
    localStorage.setItem(CONTACTOS, JSON.stringify(state.baseData));
} else {
    state.baseData = JSON.parse(localStorage.getItem(CONTACTOS));
    state.dataWithSpecialFilters = state.baseData;
}

const userBtn = document.getElementById('user-btn');

userBtn.addEventListener('click', (e) => {
    // toggle tooltip
    e.stopPropagation();
    const tooltip = userBtn.querySelector('.tooltip');
    tooltip.classList.toggle('hidden');
    console.log({tooltip})
    const onClick = (e) => {
        if (e.target.closest('.tooltip') === tooltip) return;
        tooltip.classList.add('hidden');
        window.removeEventListener('click', onClick);
    }
    window.addEventListener('click', onClick);
});

userBtn.addEventListener('click', (e) => {
    const logout = e.target.closest('#logout');
    const checkPerfil = e.target.closest('#check-perfil');

    if (!logout && !checkPerfil) return;

    if (logout) {
        localStorage.removeItem(LOGGED_USER);
        location.href = './';
    }

    if (checkPerfil) {
        location.href = './profile.html';
    }
});

const tooltip = document.querySelector('nav').querySelector(".tooltip")

export const onInput = (e, isInputEvent = true) => {
    const input = e.target.value;
    state.searchValue = input;
    if (isInputEvent) state.currentPagination = 1;
    const {currentPagination} = state;

    state.matchingRows = getMatchingRows(state.dataWithSpecialFilters, sorting, input);
    const {matchingRows} = state;

    const start = (currentPagination - 1) * MAX_ROWS_SHOWED_PER_PAGE;
    const end = currentPagination * MAX_ROWS_SHOWED_PER_PAGE;
    const filteredData = matchingRows.filter((contact, i) => {
        // if is on the current page
        return i >= start && i < end;
    });


    const thSorted = document.querySelector(`th[data-field="${sorting.field}"]`);
    const sortIconName = sorting.order === 'asc' ? 'down' : 'up';
    tableHeader.querySelectorAll('i').forEach(icon => icon.classList.add('!hidden'));
    thSorted.querySelector(`i.fa-chevron-${sortIconName}`).classList.remove('!hidden');

    const rows = filteredData.map((contact, i) => getHighlightedRows(contact, i, hiddenFields, searchInput.value));

    const tableBody = document.getElementById('contacts-table');
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML('beforeend', rows.join(''));

    const paginationText = document.getElementById('pagination-text');
    const html = `
        <span>Mostrando ${currentPagination * MAX_ROWS_SHOWED_PER_PAGE - MAX_ROWS_SHOWED_PER_PAGE + 1} a ${Math.min(currentPagination * MAX_ROWS_SHOWED_PER_PAGE, matchingRows.length)} de ${matchingRows.length} resultados</span>
    `
    paginationText.innerHTML = html;
}
onInput({target: {value: state.searchValue}}, false);


searchInput.addEventListener('input', onInput);

tbody.addEventListener('click', (e) => {
    e.stopPropagation()
    const action = e.target.closest('button[data-action]');
    console.log({action})
    if (!action) return;

    // show tooltip
    const tooltip = action.parentElement.querySelector('.tooltip');
    tooltip.classList.toggle('hidden');
    console.log({tooltip})
    const onClick = (e) => {
        if (e.target.closest('.tooltip') === tooltip) return;
        console.log('clicked outside actions tooltip')
        tooltip.classList.add('hidden');
        window.removeEventListener('click', onClick);
    }
    window.addEventListener('click', onClick)

    // handle action
    tooltip.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.textContent === 'Eliminar') {
            const tr = action.closest('tr');
            const objectDeleted = state.dataWithSpecialFilters.splice(findContactIndex(tr), 1);
            state.baseData.splice(state.baseData.indexOf(objectDeleted), 1);
            localStorage.setItem(CONTACTOS, JSON.stringify(state.baseData));
            tr.remove();
        }
        if (button.textContent === 'Editar') {
            const tr = action.closest('tr');
            const index = findContactIndex(tr);
            if (index === -1) return;
            const contactInfo = {data: state.dataWithSpecialFilters[index], index}
            localStorage.setItem(EDITED_CONTACT, JSON.stringify(contactInfo));
            localStorage.setItem(FORM_MODE, JSON.stringify({mode: 'edit'}));
            location.href = './contact-edit.html';
        }
        if (button.textContent === 'Ver') {
            const tr = action.closest('tr');
            console.log({tr})
            const index = findContactIndex(tr);
            if (index === -1) return;
            console.log({index})
            const contactInfo = {
                data: state.dataWithSpecialFilters[index], index
            }
            console.log({contactInfo});
            localStorage.setItem(EDITED_CONTACT, JSON.stringify(contactInfo));
            localStorage.setItem(FORM_MODE, JSON.stringify({mode: 'view'}));

            // redirect to contact page
            location.href = './view-contact.html';
        }
    });
});

function findContactIndex(tr) {
    return state.dataWithSpecialFilters.findIndex((contact) => {
        // check if the current tr is the same as the one in the loop
        // check all the tds to match the contact
        const [favorite, name, email, phone, address] = [...tr.querySelectorAll('td')]
        if (favorite.querySelector("i.fa-solid") && !contact.favorite) return false;
        if (!favorite.querySelector("i.fa-solid") && contact.favorite) return false;
        if (name.textContent.trim() !== contact.name) return false;
        if (email.textContent.trim() !== contact.email) return false;
        if (phone.textContent.trim() !== contact.phoneNumber) return false;
        if (address.textContent.trim() !== contact.address) return false;
        return true;
    });
}

import './buttons-logic.js';

