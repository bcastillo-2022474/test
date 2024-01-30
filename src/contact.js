const searchInput = document.getElementById('search-input');
const buttonNext = document.getElementById('button-next');
const buttonPrevious = document.getElementById('button-previous');
let MAX_PAGINATION = 5;
const hiddenFields = [];
const sorting = {
    order: 'asc',
    field: 'name',
    type: 'string'
}
// const data = [
//     {
//         name: 'Jhon Doe',
//         email: 'jhondoe@example.com',
//         phoneNumber: '12345678',
//         address: '1234 Main St'
//     },
//     {
//         name: 'Jane Doe',
//         email: 'janedoe@example.com',
//         phoneNumber: '12345678',
//         address: '1234 Main St'
//     },
//     {
//         name: 'John Smith',
//         email: 'jhonsmith@example.com',
//         phoneNumber: '12345678',
//         address: '1234 Main St'
//     }
// ]
const data = [];

for (let i = 1; i <= 20; i++) {
    data.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        phoneNumber: '12345678',
        address: '1234 Main St'
    });
}

const state = {
    currentPagination: 1,
    maxPagination: data.length / MAX_PAGINATION
}

function renderHiddenFields(hiddenFields) {
    const buttons = hiddenFields.map(field => {
        return `<button class="filter-button">
            <span>${field}</span>
            <i class="fas fa-times"></i>
        </button>`
    });
    console.log({buttons})

    const hiddenFieldsContainer = document.getElementById('hidden-fields');
    hiddenFieldsContainer.classList.remove('hidden');
    hiddenFieldsContainer.innerHTML = '';
    hiddenFieldsContainer.insertAdjacentHTML('beforeend', buttons.join(''));
}

function getSpannedText(text, input) {
    const regex = new RegExp(input, 'gi');
    return text.replace(regex, (match) => `<span class="highlited-text">${match}</span>`);
}

function getHighlightedRows(filteredData) {

    const name = getSpannedText(filteredData.name, searchInput.value);
    const email = getSpannedText(filteredData.email, searchInput.value);
    const phoneNumber = getSpannedText(filteredData.phoneNumber, searchInput.value);
    const address = getSpannedText(filteredData.address, searchInput.value);

    const isNameHidden = hiddenFields.includes('Name');
    const isEmailHidden = hiddenFields.includes('Email');
    const isPhoneNumberHidden = hiddenFields.includes('phoneNumber');
    const isAddressHidden = hiddenFields.includes('Address');

    return `
        <tr>
            <td${isNameHidden ? ' class="hidden"' : ' '}>${name}</td>
            <td${isEmailHidden ? ' class="hidden"' : ' '}>${email}</td>
            <td${isPhoneNumberHidden ? ' class="hidden"' : ' '}>${phoneNumber}</td>
            <td${isAddressHidden ? ' class="hidden"' : ' '}>${address}</td>
            <td>
                <button class="text-neutral-400 w-full rounded">...</button>
            </td>
        </tr>
    `
}

const onInput = (e) => {
    const input = e.target.value;
    const {currentPagination} = state;

    const filteredData = data.filter((contact, i) => {
        if (i + 1 <= ((currentPagination * MAX_PAGINATION) - MAX_PAGINATION) || i + 1 > ((currentPagination * MAX_PAGINATION))) return false;

        return Object.keys(contact).reduce((isMatch, key) => {
            const value = contact[key];
            if (!isMatch) return value.toLowerCase().includes(input.toLowerCase().trim()) || false;
            return isMatch;
        }, false);
    }).toSorted((a, b) => {
        if (sorting.type === 'string') {
            if (sorting.order === 'asc') return a[sorting.field].localeCompare(b[sorting.field]);
            return b[sorting.field].localeCompare(a[sorting.field]);
        }
        // we assume that the type is number
        if (sorting.order === 'asc') return a[sorting.field] - b[sorting.field];
        return b[sorting.field] - a[sorting.field];
    })

    const thSorted = document.querySelector(`th[data-field="${sorting.field}"]`);
    const sortIconName = sorting.order === 'asc' ? 'down' : 'up';
    theader.querySelectorAll('i').forEach(icon => icon.classList.add('!hidden'));
    thSorted.querySelector(`i.fa-chevron-${sortIconName}`).classList.remove('!hidden');

    const rows = filteredData.map(contact => getHighlightedRows(contact));

    const tableBody = document.getElementById('contacts-table');
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML('beforeend', rows.join(''));

    const paginationText = document.getElementById('pagination-text');
    const html = `
        <span>Mostrando ${currentPagination * MAX_PAGINATION - MAX_PAGINATION + 1} a ${currentPagination * MAX_PAGINATION} de ${data.length} resultados</span>
    `
    paginationText.innerHTML = html;


}

searchInput.addEventListener('input', onInput);

buttonNext.addEventListener('click', () => {
    // render next page
    if (state.maxPagination === state.currentPagination) return;
    state.currentPagination += 1;
    onInput({target: {value: searchInput.value}});
});

buttonPrevious.addEventListener('click', () => {
    // render previous page
    if (state.currentPagination === 1) return;
    state.currentPagination -= 1;
    onInput({target: {value: searchInput.value}});
});

const theader = document.getElementById('contacts-table-header');

theader.addEventListener('contextmenu', (e) => {
    if (e.target.closest('th')) e.preventDefault();
});
theader.addEventListener('auxclick', (e) => {
    console.log('when clicked auxclick')
    const th = e.target.closest('th');
    if (!th) return;

    // hide column
    th.querySelector('.tooltip').classList.remove('hidden');
    const onClick = (e) => {
        if (e.target.closest('.tooltip')) return;
        th.querySelector('.tooltip').classList.add('hidden');
        window.removeEventListener('click', onClick);
    }
    window.addEventListener('click', onClick)
});
theader.addEventListener('click', (e) => {
    console.log('when clicked sort column')
    const th = e.target.closest('th');
    if (th.dataset.sortable === 'false') return;
    if (!th) return;

    const field = th.dataset.field;
    const type = th.dataset.type;
    const order = sorting.field !== field ? 'asc'
        : sorting.order === 'asc' ? 'desc' : 'asc';

    sorting.field = field;
    sorting.type = type;
    sorting.order = order;

    onInput({target: {value: searchInput.value}});
})

theader.addEventListener('click', (e) => {
    console.log('when clicked hide column')
    const tooltip = e.target.closest('.tooltip');
    if (!tooltip) return;

    const th = e.target.closest('th');
    const field = th.dataset.field;
    const position = Array.from(th.parentElement.children).indexOf(th);
    const tbody = document.getElementById('contacts-table');
    const rows = [...tbody.querySelectorAll('tr')];
    console.log({length: rows.length})
    rows.forEach(tr => {
        console.log(tr.children[position])
        tr.children[position].classList.add('hidden');
    });
    console.log(th)
    th.classList.add('hidden');

    // add the field to the hidden fields
    hiddenFields.push([...th.querySelectorAll('span')].at(-1).textContent);
    console.log({text: th.dataset.field, hiddenFields})
    renderHiddenFields(hiddenFields);
})


onInput({target: {value: ''}});

