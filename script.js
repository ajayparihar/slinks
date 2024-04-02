// Author: Ajay Singh
// Version: 1.1
// Date: 23-12-2023

async function loadLinks() {
    // Fetching data from Google sheet (publish as csv)
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbVqOy2smBdsFtcJ4zUiPSETZW3cFeGEnEu0jjk9XCW4ifrFT3g33x-1czdXzaOVMq1IgdGjDwXIwx/pub?gid=0&single=true&output=csv');
    const dataBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(dataBuffer, { type: 'array' });

    // Extracting data from the sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const links = XLSX.utils.sheet_to_json(sheet, { header: ['Link', 'URL'] });

    const linksDiv = document.getElementById('links');

    // Creating HTML elements for each link
    links.forEach(item => {
        const { Link, URL } = item;

        const linkElement = document.createElement('div');
        linkElement.classList.add('link');
        linkElement.innerHTML = `<p><strong>${Link}</strong></p>`;
        linkElement.onclick = function () {
            copyToClipboard(URL);
        };

        linksDiv.appendChild(linkElement);
    });
}

let initialLoad = true; // Flag to track initial load

const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const links = document.querySelectorAll('.link');

        // Filtering and highlighting links based on search input
        links.forEach(link => {
            const linkText = link.innerText.toLowerCase();

            if (linkText.includes(searchValue)) {
                link.style.display = 'block';
                if (!initialLoad) {
                    const highlightedText = linkText.replace(new RegExp(escapeRegExp(searchValue), 'gi'), (match) => `<span class="highlight">${match}</span>`);
                    link.innerHTML = `<p><strong>${highlightedText}</strong></p>`;
                }
            } else {
                link.style.display = 'none';
            }
        });

        initialLoad = false;
    });
}

function copyToClipboard(text) {
    // Copying text to clipboard
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }

    showCopiedToast();
}

function showCopiedToast() {
    // Showing a toast notification for copied link
    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Function to refresh the page
function refreshPage() {
    location.reload();
}

loadLinks();
