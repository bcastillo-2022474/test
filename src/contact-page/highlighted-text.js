function getSpannedText(text, input) {
    const regex = new RegExp(input, 'gi');
    return text.replace(regex, (match) => `<span class="highlited-text">${match}</span>`);
}

export function getHighlightedRows(filteredData, hiddenFields, searchValue) {

    const name = getSpannedText(filteredData.name, searchValue);
    const email = getSpannedText(filteredData.email, searchValue);
    const phoneNumber = getSpannedText(filteredData.phoneNumber, searchValue);
    const address = getSpannedText(filteredData.address, searchValue);

    const isNameHidden = hiddenFields.includes('name');
    const isEmailHidden = hiddenFields.includes('email');
    const isPhoneNumberHidden = hiddenFields.includes('phoneNumber');
    const isAddressHidden = hiddenFields.includes('address');

    return `
        <tr>
            <td><span class="flex justify-center star"><i class="cursor-pointer fa-${filteredData.favorite ? 'solid' : 'regular'} fa-star"></i></span></td>
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
