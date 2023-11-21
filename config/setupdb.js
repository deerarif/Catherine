const { sequelize } = require("./database");
// require("dotenv").config();
// sequelize.beforeSync(() =>
//   sequelize.query(
//     "DROP TABLE `Order`, `Stock_Barang`, `Status`, `UserData`,`Menu`,`DataDealer`,`Barang`;"
//   )
// );
sequelize
  .sync()
  .then(() => sequelize.close())
  .catch((err) => console.error(err));
