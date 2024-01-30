export const searchInput = document.getElementById('search-input');
export const hiddenFieldsContainer = document.getElementById('hidden-fields');
export const tableHeader = document.getElementById('contacts-table-header');
export const tbody = document.getElementById('contacts-table');
export let MAX_ROWS_SHOWED_PER_PAGE = 5;
export const hiddenFields = [];
export const buttonNext = document.getElementById('button-next');
export const buttonPrevious = document.getElementById('button-previous');

export const addFilterButton = document.getElementById('add-filters-button');

export const sorting = {
    order: 'asc',
    field: 'name',
    type: 'string'
}

export const buttonCreateContact = document.getElementById('button-create');

export const state = {
    currentPagination: 1,
    maxPagination: 0,
    // it updates itself on input render, you can also
    // initialize it with getMatchingRows(data, sorting, searchInput.value)
    // but it will be overwritten by the same value on the first render,
    // and it is a waste of resources
    matchingRows: [],
    searchValue: searchInput.value,
    dataWithSpecialFilters: [],
    baseData: []
}