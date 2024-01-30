const state = {
  currentPagination: 1,
  rowsNeeededToHide: []
};
const searchInput = document.getElementById("search-input");
const table = document.getElementById("table");
const tbody = table.querySelector("tbody");
const buttonsPaginationContainer = document.getElementById(
  "container-buttons-pagination"
);
const MAX_TUPLES = 5;

const columnMap = {};
const isColumnNumberOnly = (thPosition, rows) => {
  if (columnMap[thPosition]) return columnMap[thPosition];
  const columns = rows.map(
    (row) => [...row.querySelectorAll("td")][thPosition]
  );
  columnMap[thPosition] = columns.every(
    (col) => !isNaN(Number(col.textContent.trim()))
  );
  return columnMap[thPosition];
};

const createPaginationButtons = () => {
  const arr = [...tbody.querySelectorAll("tr:not(#spinner)")];
  const buttonsQuantity = Math.ceil(arr.length / MAX_TUPLES);
  for (let i = 1; i <= buttonsQuantity; i++) {
    buttonsPaginationContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="rounded-sm w-[40px] h-[40px] text-sm">${i}</button>`
    );
    console.log(buttonsPaginationContainer);
  }
};

createPaginationButtons();

const getHTMLHighlighted = (element, searchValue) => {
  console.log({ element });
  const unnecessaryDivs = new Set();
  element.querySelectorAll("span[data-highlighted=true]").forEach((span) => {
    unnecessaryDivs.add(span.parentNode);
    span.parentNode.replaceChild(
      document.createTextNode(span.textContent),
      span
    );
  });
  unnecessaryDivs.forEach((div) => {
    if (!div.textContent.trim()) {
      div.parentNode.removeChild(div);
      return;
    }
    div.parentNode.replaceChild(document.createTextNode(div.textContent), div);
  });
  console.log({ element }, "SEARCH = ''");

  if (searchValue === "") return true;

  const regex = new RegExp(searchValue, "gi");

  const walk = (node) => {
    if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== node.ELEMENT_NODE)
      return false;
    if (node.nodeType === Node.ELEMENT_NODE) {
      return [...node.childNodes].some(walk);
    }

    const originalText = node.textContent;
    const doesMatch = originalText.match(regex);
    if (!doesMatch) return false;
    const [match] = doesMatch;
    const html = originalText.replace(
      regex,
      `<span data-highlighted="true" class="bg-indigo-600">${match}</span>`
    );
    console.log({ html, regex });

    // Create a new temporary element to hold the replacement HTML
    const container = document.createElement("div");
    container.innerHTML = html;

    // Get the first child of the temporary element (the <span> element)
    node.parentNode.replaceChild(container, node);
    return true;
  };

  return [...element.childNodes].some(walk);
};

const getRowsThatDontMatchSearch = (rows, searchValue) =>
  rows.filter((row) => {
    const cells = [...row.children];

    // TO AVOID ACTIONS MATCHING THE SEARCH VALUE
    cells.pop();

    console.log(cells.length);

    const someMatch = cells.reduce((someMatch, cell) => {
      const match = getHTMLHighlighted(cell, searchValue);
      console.log(match);
      if (match) return match;
      return someMatch;
      // return textValue !== cell.innerHTML || textValue !== "";
    }, false);

    return !someMatch;
  });

const hideTuples = (tuples, MAX_TUPLES, pagination = 1, set = new Set()) => {
  if (tuples.length < MAX_TUPLES) return;

  const filteredTuples = tuples.filter((element) => {
    if (set.has(element)) element.classList.add("hidden");
    return !set.has(element);
  });
  filteredTuples.forEach((element, i) => {
    element.classList.remove("hidden");
    if (i >= MAX_TUPLES * pagination - 5 && i < MAX_TUPLES * pagination) return;

    element.classList.add("hidden");
  });
  document.getElementById("showing-message").textContent = `Showing ${
    MAX_TUPLES * (pagination - 1) + 1
  } to ${Math.min(MAX_TUPLES * pagination, tuples.length)} out of ${
    tuples.length
  } results`;
};

const makeOddRowsDistinguishable = () => {
  [...tbody.querySelectorAll("tr:not(.hidden):not(#spinner)")].forEach(
    (row, i) => {
      row.classList.remove("bg-gray-100");
      if (i % 2 === 1) row.classList.add("bg-gray-100");
    }
  );
};

document.addEventListener("click", (e) => {
  const table = document.getElementById("table");
  const th = e.target.closest("th");

  if (!th) return;

  const thPosition = [...table.querySelectorAll("th")].findIndex(
    (thElement) => thElement === th
  );
  const arrowUp = th.querySelector("i.fa-chevron-up");
  const arrowDown = th.querySelector("i.fa-chevron-down");

  const tbody = table.querySelector("tbody");
  const rows = [...tbody.querySelectorAll("tr:not(#spinner)")];

  const getDirection = (arrowUp, arrowDown) => {
    if (
      arrowUp.classList.contains("hidden") &&
      arrowDown.classList.contains("hidden")
    ) {
      return "up";
    }

    if (arrowUp.classList.contains("hidden")) return "up";
    return "down";
  };

  const direction = getDirection(arrowUp, arrowDown); // up | down
  const columnsAreNumbers = isColumnNumberOnly(thPosition, rows);

  rows.sort((a, b) => {
    const textA = [...a.querySelectorAll("td")][thPosition].textContent;
    const textB = [...b.querySelectorAll("td")][thPosition].textContent;
    if (columnsAreNumbers) {
      if (direction === "up") return Number(textA) - Number(textB);
      return Number(textB) - Number(textA);
    }

    if (direction === "up") return textA.localeCompare(textB);
    return textB.localeCompare(textA);
  });

  state.rowsNeeededToHide = getRowsThatDontMatchSearch(rows, searchInput.value);

  // tbody.innerHTML = "";
  rows.forEach((row) => {
    tbody.appendChild(row); // Reorder the rows in the DOM
  });

  table.querySelector("i.fa-solid:not(.hidden)")?.classList?.add?.("hidden");

  if (direction === "up") {
    arrowUp.classList.remove("hidden");
    arrowDown.classList.add("hidden");
  }

  if (direction === "down") {
    arrowUp.classList.add("hidden");
    arrowDown.classList.remove("hidden");
  }

  const buttonPagination = [...buttonsPaginationContainer.children].find(
    (btn) => Number(btn.textContent.trim()) === state.currentPagination
  );
  buttonPagination.dispatchEvent(new Event("click", { bubbles: true }));
});

// PAGINATION
buttonsPaginationContainer.addEventListener("click", (e) => {
  const button = e.target.closest(".text-sm");
  if (!button) return;

  [...buttonsPaginationContainer.children].forEach((btn) =>
    btn.classList.remove("bg-indigo-600")
  );

  hideTuples(
    [...tbody.querySelectorAll("tr:not(#spinner)")],
    MAX_TUPLES,
    Number(button.textContent.trim()),
    new Set(state.rowsNeeededToHide)
  );

  state.currentPagination = Number(button.textContent.trim());

  makeOddRowsDistinguishable();
  button.classList.add("bg-indigo-600");
  tbody.classList.remove("first:[&_tr]:table-row");
  tbody.classList.remove("[&_tr]:hidden");
  tbody.classList.add("first:[&_tr]:hidden");
});

[...tbody.querySelectorAll("tr:not(#spinner)")].forEach(
  (child, i) => i % 2 === 1 && child.classList.add("bg-gray-100")
);

const firstColumn = table.querySelector("th");
firstColumn.dispatchEvent(new Event("click", { bubbles: true }));

const nextButton = document.getElementById("next-button");

nextButton.addEventListener("click", () => {
  const btn = [...buttonsPaginationContainer.children].find(
    (el) => Number(el.textContent.trim()) === state.currentPagination + 1
  );

  if (!btn) return;
  btn.dispatchEvent(new Event("click", { bubbles: true }));
});

const previousButton = document.getElementById("previous-button");

previousButton.addEventListener("click", () => {
  const btn = [...buttonsPaginationContainer.children].find(
    (el) => Number(el.textContent.trim()) === state.currentPagination - 1
  );

  if (!btn) return;
  btn.dispatchEvent(new Event("click", { bubbles: true }));
});

searchInput.addEventListener("input", (e) => {
  const rows = [...tbody.querySelectorAll("tr:not(#spinner)")];

  const thSorted = table.querySelector("i.fa-solid:not(.hiden)").closest("th");
  thSorted.dispatchEvent(new Event("click", { bubbles: true }));
  thSorted.dispatchEvent(new Event("click", { bubbles: true }));
});
