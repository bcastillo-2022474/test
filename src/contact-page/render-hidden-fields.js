export function renderHiddenFields(hiddenFields, hiddenFieldsContainer) {
    const buttons = hiddenFields.map(field => {
        const thText = Array.from(document.querySelector(`th[data-field="${field}"]`).querySelectorAll('span')).at(-1).textContent;
        return `<button data-hidden-column-button-switch data-field="${field}" class="filter-button">
                    <span>${thText}</span>
                    <i class="fas fa-times"></i>
                </button>`
    });
    console.log({buttons})

    hiddenFieldsContainer.classList.remove('hidden');
    hiddenFieldsContainer.innerHTML = '';
    hiddenFieldsContainer.insertAdjacentHTML('beforeend', buttons.join(''));
}