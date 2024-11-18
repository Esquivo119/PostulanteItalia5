// Función para manejar la carga de archivos PDF
document.getElementById('pdf-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const fileInput = document.getElementById('pdf-upload');
    const pdfFile = fileInput.files[0];

    if (pdfFile && pdfFile.type === "application/pdf") {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const pdfURL = e.target.result;
            savePDFToLocalStorage(pdfURL);
            displayPDFs();
        };

        reader.readAsDataURL(pdfFile);
    } else {
        alert("Por favor, selecciona un archivo PDF válido.");
    }
});

// Guardar el PDF en el almacenamiento local
function savePDFToLocalStorage(pdfURL) {
    let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
    pdfs.push(pdfURL);
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
}

// Mostrar los PDFs guardados en el almacenamiento local
function displayPDFs() {
    const pdfList = document.getElementById('pdf-list');
    pdfList.innerHTML = ''; // Limpiar la lista antes de mostrar los nuevos archivos

    const pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];

    if (pdfs.length === 0) {
        pdfList.innerHTML = "<p>No hay PDFs cargados.</p>";
    } else {
        pdfs.forEach((pdfURL, index) => {
            const pdfItem = document.createElement('div');
            pdfItem.classList.add('pdf-item');
            pdfItem.innerHTML = `
                <p><strong>Documento ${index + 1}</strong></p>
                <iframe src="${pdfURL}" width="100%" height="400px"></iframe>
                <button onclick="deletePDF(${index})">Eliminar</button>
            `;
            pdfList.appendChild(pdfItem);
        });
    }
}

// Eliminar un PDF del almacenamiento local
function deletePDF(index) {
    let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
    pdfs.splice(index, 1); // Eliminar el archivo en el índice especificado
    localStorage.setItem('pdfs', JSON.stringify(pdfs)); // Guardar la lista actualizada
    displayPDFs(); // Actualizar la lista de documentos
}

// Al cargar la página, mostrar los PDFs guardados
window.onload = function() {
    displayPDFs();
};
function verVolver() {
    window.location.href = 'index.html';
}

