const PDFDocument = require("pdfkit");
const buildPdf = require("./buildSalarySlipPDF");

module.exports = function generateSalarySlip(res, salary, user, department) {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=SalarySlip_${salary.month}_${salary.year}.pdf`
  );
  doc.pipe(res);
  buildPdf(doc, salary, user, department);
  doc.end();
};
