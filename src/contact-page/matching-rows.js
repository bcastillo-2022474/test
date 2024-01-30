export const getMatchingRows = (data, sorting, input) => {
    return data.toSorted((a, b) => {
        if (sorting.type === 'string') {
            if (sorting.order === 'asc') return a[sorting.field].localeCompare(b[sorting.field]);
            return b[sorting.field].localeCompare(a[sorting.field]);
        }
        // we assume that the type is number
        if (sorting.order === 'asc') return Number(a[sorting.field]) - Number(b[sorting.field]);
        return Number(b[sorting.field]) - Number(a[sorting.field]);
    }).filter((contact) => {
        return Object.keys(contact).reduce((isMatch, key) => {
            const value = contact[key];
            if (typeof value === 'boolean') return isMatch;
            // check if the column is hidden
            const isHidden = document.querySelector(`th[data-field="${key}"]`).classList.contains('hidden');
            if (isHidden) return isMatch;

            if (!isMatch) return value.toLowerCase().includes(input.toLowerCase().trim()) || false;
            return isMatch;
        }, false);
    })
}