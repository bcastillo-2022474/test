import {onInput} from './contact.js';
import {renderHiddenFields} from "./render-hidden-fields.js";
import {
    addFilterButton, buttonCreateContact,
    buttonNext, buttonPrevious,
    hiddenFields,
    hiddenFieldsContainer,
    MAX_ROWS_SHOWED_PER_PAGE,
    searchInput,
    sorting,
    state, tableHeader,
    tbody
} from "./constants.js";


buttonNext.addEventListener('click', () => {
    // render next page
    if (Math.ceil(state.matchingRows.length / MAX_ROWS_SHOWED_PER_PAGE) <= state.currentPagination) return;
    state.currentPagination += 1;
    onInput({target: {value: state.searchValue}}, false);
});

buttonPrevious.addEventListener('click', () => {
    // render previous page
    if (state.currentPagination === 1) return;
    state.currentPagination -= 1;
    onInput({target: {value: state.searchValue}}, false);
});

tableHeader.addEventListener('contextmenu', (e) => {
    if (e.target.closest('th')) e.preventDefault();
});
tableHeader.addEventListener('auxclick', (e) => {
    console.log('when clicked auxclick')
    const th = e.target.closest('th');
    if (!th) return;

    // hide column
    const tooltip = th.querySelector('.tooltip')
    tooltip.classList.remove('hidden');
    const onClick = (e) => {
        if (e.target.closest('.tooltip') === tooltip) return;
        console.log('click on window frist')
        tooltip.classList.add('hidden');
        window.removeEventListener('click', onClick);
    }
    window.addEventListener('click', onClick)
});
tableHeader.addEventListener('click', (e) => {
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

    onInput({target: {value: searchInput.value}}, false);
})

tableHeader.addEventListener('click', (e) => {
    console.log('when clicked hide column')
    const tooltip = e.target.closest('.tooltip');
    if (!tooltip) return;

    const th = e.target.closest('th');
    const field = th.dataset.field;
    console.log({length: th.parentElement.children.length})
    const position = Array.from(th.parentElement.children).indexOf(th);
    const rows = [...tbody.querySelectorAll('tr')];
    console.log({length: rows.length})
    rows.forEach(tr => {
        console.log(tr.children[position])
        tr.children[position].classList.add('hidden');
    });
    console.log(th)
    th.classList.add('hidden');

    // add the field to the hidden fields
    hiddenFields.push(th.dataset.field);
    console.log({text: field, hiddenFields})
    renderHiddenFields(hiddenFields, hiddenFieldsContainer);
})

hiddenFieldsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-hidden-column-button-switch]');
    if (!button) return;

    const field = button.dataset.field;
    const th = document.querySelector(`th[data-field="${field}"]`);
    const position = Array.from(th.parentElement.children).indexOf(th);
    const rows = [...tbody.querySelectorAll('tr')];
    rows.forEach(tr => {
        tr.children[position].classList.remove('hidden');
    });
    th.classList.remove('hidden');

    // remove the field from the hidden fields
    hiddenFields.splice(hiddenFields.indexOf(field), 1);
    renderHiddenFields(hiddenFields, hiddenFieldsContainer);
});

tbody.addEventListener('click', (e) => {
    const star = e.target.closest('i.fa-star');
    if (!star) return;

    console.log({star})
    const tr = star.closest('tr');
    const index = Array.from(tr.parentElement.children).indexOf(tr);
    const contact = state.matchingRows[index];
    console.log({favorite: contact.favorite})
    // the contrary of the current boolean value
    contact.favorite = !contact.favorite;
    onInput({target: {value: searchInput.value}}, false);
});

addFilterButton.addEventListener('click', (e) => {
    // show tooltip
    const tooltip = e.target.closest('.tooltip');
    if (!tooltip) return;
    tooltip.dataset.filter = tooltip.dataset.filter === 'true' ? 'false' : 'true';

    state.dataWithSpecialFilters = state.baseData.filter((item) => {
        return `${item.favorite}` === tooltip.dataset.filter;
    });

    onInput({target: {value: state.searchValue}}, false);
});

addFilterButton.addEventListener('click', (e) => {
    // show tooltip
    e.preventDefault();
    e.stopPropagation()
    const button = e.target.closest('button');
    if (!button) return;

    const tooltip = button.parentElement.querySelector('.tooltip');
    console.log('whenc click on the add filter button')

    tooltip.classList.remove('hidden');
    // for some weird reason the click event is being triggered
    // on the window right after the tooltip is shown
    const onClick = (e) => {
        if (e.target.closest('.tooltip') === tooltip) return;
        console.log('click on window')
        tooltip.classList.add('hidden');
        window.removeEventListener('click', onClick);
    }
    window.addEventListener('click', onClick)
})

buttonCreateContact.addEventListener('click', (e) => {
    // save state
    localStorage.setItem('contact-edit', JSON.stringify({'mode': 'create'}));
    // redirect
    window.location.href = 'contact-edit.html';
});