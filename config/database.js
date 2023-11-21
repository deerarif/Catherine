const { Sequelize, DataTypes, DATE, STRING } = require("sequelize");
require("dotenv").config();
// Create a Sequelize instance and specify the database connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);
const UserData = sequelize.define(
  "UserData",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    noHP: {
      type: DataTypes.STRING(15),
    },
    Name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "UserData",
    timestamps: false,
  }
);
const Menu = sequelize.define(
  "Menu",
  {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Nama: {
      type: DataTypes.STRING(50),
    },
    DetailMenu: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "Menu",
    timestamps: false,
  }
);
const Status = sequelize.define(
  "Status",
  {
    Waktu: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Status",
    timestamps: false,
  }
);
const Hotline = sequelize.define(
  "Hotline",
  {
    Input: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    Respons: DataTypes.TEXT,
  },
  {
    tableName: "Hotline",
    timestamps: false,
  }
);
const Claim = sequelize.define(
  "Claim",
  {
    Input: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    Respons: DataTypes.TEXT,
  },
  {
    tableName: "Claim",
    timestamps: false,
  }
);
const Tanggal_data = sequelize.define(
  "Tanggal_Data",
  {
    Data_Updated_at: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
  },
  {
    tableName: "Tanggal_Data",
    timestamps: false,
  }
);
const Stocks = sequelize.define(
  "Stock_Barang",
  {
    Kode_Barang: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    Nama_Barang: {
      type: DataTypes.TEXT,
    },
    Harga_Barang: {
      type: DataTypes.BIGINT,
    },
    QTY_Dus_Barang: {
      type: DataTypes.BIGINT,
    },
    Status_Barang: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Stock_Barang",
    timestamps: false,
  }
);

const Orderan = sequelize.define(
  "Orderan",
  {
    Kode_Dealer: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    Tanggal_Order: {
      type: DataTypes.DATE,
    },

    Kode_Barang: {
      type: DataTypes.STRING(20),
    },
    Nama_Barang: {
      type: DataTypes.TEXT,
    },
    Quantity: {
      type: DataTypes.BIGINT,
    },
    Harga_Barang: {
      type: DataTypes.BIGINT,
    },
    Diskon: {
      type: DataTypes.DOUBLE,
    },
    Total: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "Orderan",
    timestamps: false,
  }
);

UserData.belongsToMany(Menu, { through: Status, foreignKey: "UserID" });
Menu.belongsToMany(UserData, { through: Status, foreignKey: "menu_id" });
// Stocks.hasOne(Barang, { foreignKey: "Kode_Barang" });
// Dealer.hasMany(Orderan, { foreignKey: "Kode_Dealer" });
module.exports = {
  Stocks,
  UserData,
  Status,
  Menu,
  sequelize,
  Orderan,
  Tanggal_data,
  Claim,
  Hotline,
};
