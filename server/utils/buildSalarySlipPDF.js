const PDFDocument = require("pdfkit");

module.exports = function buildSalarySlipPdf(doc, salary, user, department) {
  // --- STATIC COMPANY HEADER ---
  const headerTop = 50;
  
  // Outer Border for Header
  doc.rect(50, headerTop, 500, 60).stroke(); 
  
  // Left Side: Company Branding
  doc.font("Helvetica-Bold").fontSize(16).text("YOUR COMPANY NAME PVT LTD", 60, headerTop + 10);
  doc.font("Helvetica").fontSize(9).fillColor("#444");
  doc.text("123 Business Hub, 4th Floor, Sector 62, Noida, UP - 201301", 60, headerTop + 30);
  doc.text("GSTIN: 09AAACH1234R1Z5", 60, headerTop + 42);

  // Right Side: Document Title (Inside the same header box)
  doc.fillColor("#000").font("Helvetica-Bold").fontSize(14);
  doc.text("SALARY SLIP", 400, headerTop + 22, { align: "right", width: 140 });

  // Reset Fill Color
  doc.fillColor("#000");

  // --- EMPLOYEE INFORMATION SECTION ---
  doc.moveDown(3);
  const infoTop = 130;
  
  // Draw a light grey background for the info bar
  doc.rect(50, infoTop, 500, 40).fill("#f9f9f9").stroke("#cccccc");
  doc.fillColor("#000").fontSize(10);

  // Column 1
  doc.font("Helvetica-Bold").text("Employee Name:", 60, infoTop + 7);
  doc.font("Helvetica").text(user.name, 150, infoTop + 7);
  doc.font("Helvetica-Bold").text("Department:", 60, infoTop + 22);
  doc.font("Helvetica").text(department.name, 150, infoTop + 22);

  // Column 2
  doc.font("Helvetica-Bold").text("Employee ID:", 300, infoTop + 7);
  doc.font("Helvetica").text(user.employeeId || "N/A", 380, infoTop + 7);
  doc.font("Helvetica-Bold").text("Month/Year:", 300, infoTop + 22);
  doc.font("Helvetica").text(`${salary.month} / ${salary.year}`, 380, infoTop + 22);

  // --- EARNINGS & DEDUCTIONS TABLE ---
  const tableTop = 190;
  const tableHeight = 150;
  
  // Draw Table Frame
  doc.rect(50, tableTop, 500, 20).fill("#333").stroke(); // Header Bar
  doc.rect(50, tableTop + 20, 500, tableHeight).fill("#fff").stroke(); // Data Area
  doc.moveTo(300, tableTop).lineTo(300, tableTop + tableHeight + 20).stroke(); // Middle Vertical Line

  // Table Headers
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(10);
  doc.text("EARNINGS", 60, tableTop + 6);
  doc.text("AMOUNT", 220, tableTop + 6);
  doc.text("DEDUCTIONS", 310, tableTop + 6);
  doc.text("AMOUNT", 470, tableTop + 6);

  // Table Content
  doc.fillColor("#000").font("Helvetica");
  let currentY = tableTop + 30;
  
  const earnings = Object.entries(salary.earnings);
  const deductions = Object.entries(salary.deductions);
  const maxRows = Math.max(earnings.length, deductions.length);

  for (let i = 0; i < maxRows; i++) {
    if (earnings[i]) {
      doc.text(earnings[i][0].toUpperCase(), 60, currentY);
      doc.text(`Rs. ${earnings[i][1].toLocaleString()}`, 220, currentY);
    }
    if (deductions[i]) {
      doc.text(deductions[i][0].toUpperCase(), 310, currentY);
      doc.text(`Rs. ${deductions[i][1].toLocaleString()}`, 470, currentY);
    }
    currentY += 18;
  }

  // --- TOTALS & NET SALARY ---
  const summaryTop = tableTop + tableHeight + 30;

  doc.font("Helvetica-Bold");
  doc.text(`Gross Salary: Rs. ${salary.grossSalary.toLocaleString()}`, 50, summaryTop);
  doc.text(`Total Deductions: Rs. ${salary.totalDeductions.toLocaleString()}`, 310, summaryTop);

  // Net Salary Highlight Box
  doc.rect(50, summaryTop + 20, 500, 30).fill("#eef2ff").stroke("#3f51b5");
  doc.fillColor("#3f51b5").fontSize(12).text("NET SALARY (Take Home):", 70, summaryTop + 30);
  doc.text(`Rs. ${salary.netSalary.toLocaleString()}`, 450, summaryTop + 30, { align: "right", width: 80 });

  // --- FOOTER ---
  doc.fillColor("#999").fontSize(8)
     .text("This is a system-generated payslip.", 50, 750, { align: "center" });
};