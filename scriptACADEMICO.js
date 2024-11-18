// Abrir conexión a IndexedDB
const dbName = "PDFDatabase";
let db;

function initDB() {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("pdfs")) {
            db.createObjectStore("pdfs", { autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        displayPDFs();
    };

    request.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
}

// Guardar PDF en IndexedDB
function savePDFToDB(pdfFile) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const transaction = db.transaction(["pdfs"], "readwrite");
        const store = transaction.objectStore("pdfs");
        const pdfData = {
            name: pdfFile.name,
            data: e.target.result,
        };
        store.add(pdfData);

        transaction.oncomplete = function () {
            displayPDFs();
        };

        transaction.onerror = function () {
            console.error("Error al guardar el PDF.");
        };
    };

    reader.readAsDataURL(pdfFile);
}

// Mostrar PDFs guardados
function displayPDFs() {
    const pdfList = document.getElementById("pdf-list");
    pdfList.innerHTML = "";  // Limpiar la lista antes de mostrar los nuevos archivos

    const transaction = db.transaction(["pdfs"], "readonly");
    const store = transaction.objectStore("pdfs");
    const request = store.openCursor();

    request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const pdfItem = document.createElement("div");
            pdfItem.classList.add("pdf-item");
            pdfItem.innerHTML = `
                <p><strong>${cursor.value.name}</strong></p>
                <iframe src="${cursor.value.data}" title="${cursor.value.name}"></iframe>
                <button onclick="deletePDF(${cursor.key})">Eliminar</button>
            `;
            pdfList.appendChild(pdfItem);
            cursor.continue();
        } else if (!pdfList.innerHTML) {
            pdfList.innerHTML = "<p>No hay PDFs guardados.</p>";
        }
    };

    request.onerror = function () {
        console.error("Error al cargar los PDFs.");
    };
}

// Eliminar PDF de IndexedDB
function deletePDF(key) {
    const transaction = db.transaction(["pdfs"], "readwrite");
    const store = transaction.objectStore("pdfs");
    const request = store.delete(key);

    request.onsuccess = function () {
        displayPDFs();
    };

    request.onerror = function () {
        console.error("Error al eliminar el PDF.");
    };
}

// Manejar el envío del formulario
document.getElementById("pdf-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("pdf-upload");
    const pdfFile = fileInput.files[0];

    if (pdfFile && pdfFile.type === "application/pdf") {
        savePDFToDB(pdfFile);
    } else {
        alert("Por favor, selecciona un archivo PDF válido.");
    }
});

function verVolver() {
    window.location.href = 'index.html';
}

// Inicializar la base de datos al cargar la página
window.onload = initDB;
