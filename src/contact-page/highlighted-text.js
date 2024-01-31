function getSpannedText(text, input) {
    const regex = new RegExp(input, 'gi');
    return text.replace(regex, (match) => `<span class="highlited-text">${match}</span>`);
}

export function getHighlightedRows(filteredData, index, hiddenFields, searchValue) {

    const name = getSpannedText(filteredData.name, searchValue);
    const email = getSpannedText(filteredData.email, searchValue);
    const phoneNumber = getSpannedText(filteredData.phoneNumber, searchValue);
    const address = getSpannedText(filteredData.address, searchValue);

    const isNameHidden = hiddenFields.includes('name');
    const isEmailHidden = hiddenFields.includes('email');
    const isPhoneNumberHidden = hiddenFields.includes('phoneNumber');
    const isAddressHidden = hiddenFields.includes('address');

    return `
        <tr class="relative" data-position="${index}">
            <td><span class="flex justify-center star"><i class="cursor-pointer fa-${filteredData.favorite ? 'solid' : 'regular'} fa-star"></i></span></td>
            <td${isNameHidden ? ' class="hidden"' : ' '}>${name}</td>
            <td${isEmailHidden ? ' class="hidden"' : ' '}>${email}</td>
            <td${isPhoneNumberHidden ? ' class="hidden"' : ' '}>${phoneNumber}</td>
            <td${isAddressHidden ? ' class="hidden"' : ' '}>${address}</td>
            <td> <!-- Add a class here -->
                <div class="w-full flex justify-center">
                    <button data-action class="w-full text-neutral-400 px-2 rounded"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div data-filter="false" class="tooltip tooltip-actions flex hidden flex-col">
                        <button class="cursor-pointer px-2 py-1 border border-black rounded">Ver</button>
                        <button class="cursor-pointer px-2 py-1 border border-black rounded">Editar</button>
                        <button class="cursor-pointer px-2 py-1 border border-black rounded text-red-500">Eliminar</button>
                    </div>
                </div>
            </td>
        </tr>
    `
}
