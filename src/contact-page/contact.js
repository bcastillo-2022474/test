import {getHighlightedRows} from "./highlighted-text.js";
import {getMatchingRows} from "./matching-rows.js";
import {EDITED_CONTACT, FORM_MODE} from "../local-storage-constants.js";

import {
    hiddenFields,
    MAX_ROWS_SHOWED_PER_PAGE,
    searchInput,
    sorting,
    state,
    tableHeader, tbody
} from "./constants.js";

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

export const onInput = (e, isInputEvent = true) => {
    const input = e.target.value;
    state.searchValue = input;
    if (isInputEvent) state.currentPagination = 1;
    const {currentPagination} = state;

    state.matchingRows = getMatchingRows(state.dataWithSpecialFilters, sorting, input);
    ;
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
            const objectDeleted = state.dataWithSpecialFilters.splice(+tr.dataset.position, 1);
            state.baseData.splice(state.baseData.indexOf(objectDeleted), 1);
            tr.remove();
        }
        if (button.textContent === 'Editar') {
            const tr = action.closest('tr');
            const index = tr.dataset.position;
            const contactInfo = {data: state.dataWithSpecialFilters[index], index}
            localStorage.setItem(EDITED_CONTACT, JSON.stringify(contactInfo));
            localStorage.setItem(FORM_MODE, JSON.stringify({mode: 'edit'}));
            location.href = './contact-edit.html';
        }
        if (button.textContent === 'Ver') {
            // redirect to contact page
        }
    });
});

import './buttons-logic.js';

