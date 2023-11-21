const pdf = require("pdf-creator-node");
const fs = require("fs");
const { Rupiah } = require("../controller/controller");

// Read the HTML template
const templateHtml = fs.readFileSync("assets/template.html", "utf8");

function Makeinvoice(data) {
  let filename = Math.random() + "_invoice" + ".pdf"; //make random pdf name
  const options = {
    format: "A4",
    orientation: "potrait",
    border: "10mm",
    header: {
      height: "0px",
    },
    footer: {
      height: "50px",
      contents: {
        default: "",
        last:
          '<footer style="height: 100%;"><table style="text-align: center; font-size:1rem;border-bottom: 1px solid black; border-top: 1px solid black; width: 100%;"><tr><td style="text-align: left; padding-left: 10px;">Total QTY :</td><td style="width: 26.6%; text-align: end; font-weight: bold;"> ' +
          data["QTY_Total"] +
          ' </td><td style="text-align: end; padding-right: 8%; ">Total Harga :</td><td style="text-align: end; padding-right: 8.3%; font-weight: bold;">' +
          Rupiah.format(data["Harga_Total"]).replace(/\,00$/, ",-") +
          '</td></tr></table></footer>',
      },
    },
  };
  // Create a document using the template and data
  const document = {
    html: templateHtml,
    data: data,
    path: "public/" + filename,
    type: "pdf",
  };
  pdf.create(document, options).catch((error) => {
    console.error(error);
  });
  return "https://catherine-hso-kaltim-2.online/" + filename;
}
module.exports = { Makeinvoice };
