const { GetInvoiceData } = require("./controller/controller");
const data1 = {
  Kode: "5200020099",
  Tgl: new Date("2023-03-31"),
};
function Main(data) {
  GetInvoiceData(data)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}
Main(data1);
