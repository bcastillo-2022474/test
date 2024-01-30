export function updateUIOnError(input, message) {
    input.classList.add('touched');
    input.nextElementSibling.textContent = message;
    input.nextElementSibling.classList.remove('hidden');
    input.dataset.valid = 'false';
}

export function updateUiOnSuccess(input) {
    input.classList.remove('touched');
    input.nextElementSibling.classList.add('hidden');
    input.dataset.valid = 'true'
}

export function resetUIOnSuccess(input) {
    input.classList.remove('touched');
    input.nextElementSibling.classList.add('hidden');
    input.nextElementSibling.textContent = '';
    input.dataset.valid = 'true';
}