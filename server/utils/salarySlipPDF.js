const PDFDocument = require("pdfkit");

module.exports = function generateSalarySlip(res, salary, user, department) {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=SalarySlip_${salary.month}_${salary.year}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text("Salary Slip", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Employee Name: ${user.name}`);
  doc.text(`Employee ID: ${user.employeeId || "N/A"}`);
  doc.text(`Department: ${department.name}`);
  doc.text(`Month / Year: ${salary.month}/${salary.year}`);
  doc.moveDown();

  doc.fontSize(14).text("Earnings");
  doc.fontSize(12);
  Object.entries(salary.earnings).forEach(([key, val]) => {
    doc.text(`${key.toUpperCase()} : ₹ ${val}`);
  });

  doc.moveDown();
  doc.fontSize(14).text("Deductions");
  doc.fontSize(12);
  Object.entries(salary.deductions).forEach(([key, val]) => {
    doc.text(`${key.toUpperCase()} : ₹ ${val}`);
  });

  doc.moveDown();
  doc.fontSize(12).text(`Gross Salary: ₹ ${salary.grossSalary}`);
  doc.text(`Total Deductions: ₹ ${salary.totalDeductions}`);
  doc.fontSize(14).text(`Net Salary: ₹ ${salary.netSalary}`, {
    underline: true,
  });

  doc.end();
};
