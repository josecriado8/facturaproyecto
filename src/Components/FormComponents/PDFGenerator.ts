import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
    interface jsPDF {
        lastAutoTable?: { finalY: number };
    }
}

interface Concepto {
    concept: string;
    euros: string;
}

interface FacturaDataProps {
    clientName: string;
    street: string;
    postalCode: string;
    phone: string;
    cifDni: string;
    city: string;
    conceptos: Concepto[];
    baseImponible: string;
    iva: string;
    importeIva: string;
    total: string;
}

// Tabla de empresa
const generarPDF = (data: FacturaDataProps) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const spacing = 10;
    const leftColWidth = 80;
    const rightColX = margin + leftColWidth + spacing;
    const rightColWidth = pageWidth - rightColX - margin;

    const empresaDatos = [
        'Nombre Empresa: X',
        'C/ X',
        'C. Postal: X',
        'DNI: X'
    ];

    // Tabla de cliente
    autoTable(doc, {
        head: [['DATOS DEL CLIENTE']],
        body: [
            [`Nombre: ${data.clientName}`],
            [`Dirección: ${data.street}`],
            [`CP: ${data.postalCode}`],
            [`Teléfono: ${data.phone}`],
            [`CIF/DNI: ${data.cifDni}`],
            [`Ciudad: ${data.city}`]
        ],
        startY: margin,
        tableWidth: leftColWidth,
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: leftColWidth } },
        theme: 'grid'
    });

    
    const empresaTableX = rightColX;
    let empresaTableY = margin;
    const empresaRowHeight = 8;
    const empresaTableWidth = rightColWidth;
    const empresaTableHeader = 'DATOS DE LA EMPRESA';

    doc.setFillColor(33, 150, 243);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.rect(empresaTableX, empresaTableY, empresaTableWidth, empresaRowHeight, 'F');
    doc.text(empresaTableHeader, empresaTableX + 2, empresaTableY + empresaRowHeight - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    empresaDatos.forEach((line, idx) => {
        const y = empresaTableY + empresaRowHeight * (idx + 1);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(224, 224, 224);
        doc.rect(empresaTableX, y, empresaTableWidth, empresaRowHeight, 'FD');
        doc.text(line, empresaTableX + 2, y + empresaRowHeight - 2);
    });

    const afterTopY = Math.max(
        doc.lastAutoTable?.finalY ?? margin + empresaRowHeight * (empresaDatos.length + 1),
        empresaTableY + empresaRowHeight * (empresaDatos.length + 1)
    ) + 10;

    // Tabla de fecha de generación
    const fecha = new Date();
    const fechaStr = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${fecha.getFullYear()}`;

    autoTable(doc, {
        head: [['Fecha de emisión']],
        body: [[fechaStr]],
        startY: afterTopY,
        tableWidth: 60,
        styles: { fontSize: 10, cellPadding: 4, halign: 'center' },
        headStyles: { fillColor: [33, 150, 243], textColor: 255 },
        columnStyles: { 0: { cellWidth: 60, halign: 'center' } },
        theme: 'grid'
    });


    const afterFechaY = (doc.lastAutoTable?.finalY ?? afterTopY + 20) + 8;

    // Tabla de conceptos
    autoTable(doc, {
        head: [['Concepto del trabajo', 'Euros']],
        body: data.conceptos.map(c => [c.concept, c.euros]),
        startY: afterFechaY,
        tableWidth: pageWidth - margin * 2,
        styles: { fontSize: 10, cellPadding: 4, halign: 'center' },
        headStyles: { fillColor: [33, 150, 243], textColor: 255 },
        columnStyles: { 0: { cellWidth: 'auto', halign: 'left' }, 1: { cellWidth: 30, halign: 'center' } },
        theme: 'grid'
    });

    const afterConceptosY = doc.lastAutoTable?.finalY ?? afterTopY + 30;


    // Tabla de Totales
    autoTable(doc, {
        head: [['Base Imponible', 'IVA', 'Importe IVA', 'Total']],
        body: [[
            data.baseImponible,
            data.iva,
            data.importeIva,
            data.total
        ]],
        startY: afterConceptosY + 10,
        tableWidth: pageWidth - margin * 2,
        styles: { fontStyle: 'bold', fontSize: 11, halign: 'center', cellPadding: 5 },
        headStyles: { fillColor: [224, 224, 224], textColor: 0 },
        theme: 'grid'
    });

    doc.save(`factura_${data.clientName}.pdf`);
};

export default generarPDF;