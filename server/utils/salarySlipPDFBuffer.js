const PDFDocument = require("pdfkit");
const buildPdf = require("./buildSalarySlipPDF");

module.exports = function generateSalarySlipBuffer(
  salary,
  user,
  department
) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      buildPdf(doc, salary, user, department);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
