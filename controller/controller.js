const {
  UserData,
  Status,
  sequelize,
  Orderan,
  Claim,
  Hotline,
} = require("../config/database");
const { Op } = require("sequelize");

/*Function Necessary */
let Rupiah = Intl.NumberFormat("in-ID", {
  style: "currency",
  currency: "IDR",
});
function FormatTanggal(tgl) {
  const year = parseInt(tgl.substring(0, 4));
  const month = parseInt(tgl.substring(4, 6)) - 1;
  const day = parseInt(tgl.substring(6, 8));
  return new Date(year, month, day, 0, 0, 0, 0);
}
function makePercentage(number) {
  let percentages = number * 100;
  return percentages.toString() + "%";
}
function formatDate(inputDate) {
  const date = new Date(inputDate);
  date.setDate(date.getDate() + 1);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

/*End Function Necesessary*/
const adduser = async (phone_number) => {
  const results = await UserData.create({
    noHP: phone_number,
  });
  const { UserID } = results.dataValues;
  return UserID;
};

const addrecord = async (id_user, pilihan) => {
  try {
    const add = await Status.create({
      UserID: id_user,
      menu_id: pilihan,
      Waktu: Date.now(),
    });
  } catch (err) {
    console.error(err);
  }
};
async function findUser(number_phone, choice) {
  try {
    const results = await UserData.findOne({
      where: {
        noHP: parseInt(number_phone),
      },
    });
    if (results) {
      const { UserID } = results.dataValues;
      addrecord(UserID, choice);
    } else {
      await adduser(number_phone)
        .then(async (UserID) => {
          await addrecord(UserID, choice);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
  }
}

async function getClaimData(id_claim) {
  try {
    const res = await Claim.findOne({
      where: {
        Input: id_claim,
      },
    });
    if (res) {
      return res.dataValues;
    }
    return {
      Respons:
        "Maap, aku gagal paham maksud kamu.. kak, mungkin bisa coba lagi kakak",
    };
  } catch (err) {
    throw err;
  }
}

async function getHotlineData(id_Hotline) {
  try {
    const res = await Hotline.findOne({
      where: {
        Input: id_Hotline,
      },
    });
    if (res) {
      return res.dataValues;
    }
    return {
      Respons:
        "Maap, aku gagal paham maksud kamu.. kak, mungkin bisa coba lagi kakak",
    };
  } catch (err) {
    throw err;
  }
}

//gambil data ke data base untuk genrate invoice
async function GetInvoiceData(data) {
  const { Kode, Tgl } = data;
  try {
    const res = await Orderan.findAll({
      where: {
        Kode_Dealer: Kode,
        Tanggal_Order: {
          [Op.eq]: Tgl,
        },
      },
    });

    // sequelize.close();

    const transformedData = res.reduce((result, item, index) => {
      const dataArray = item.toJSON();
      if (index === 0) {
        // Initialize the result with Kode_Dealer and Tanggal_Order
        result.Kode_Dealer = dataArray.Kode_Dealer;
        result.Tanggal_Order = formatDate(new Date(dataArray.Tanggal_Order));
        result.List = [];
        result.QTY_Total = 0;
        result.Harga_Total = 0;
      }
      result.QTY_Total = dataArray.Quantity + result.QTY_Total;
      result.Harga_Total = dataArray.Total + result.Harga_Total;
      // Transform the data and push it to the List array
      result.List.push({
        No: result.List.length + 1,
        Kode_Barang: dataArray.Kode_Barang,
        Nama_Barang: dataArray.Nama_Barang,
        Quantity: dataArray.Quantity,
        Harga_Barang: Rupiah.format(dataArray.Harga_Barang).replace(
          /\,00$/,
          ""
        ),
        Diskon: makePercentage(dataArray.Diskon),
        Total: Rupiah.format(dataArray.Total).replace(/\,00$/, ""),
      });
      return result;
    }, {});

    return transformedData;
  } catch (err) {
    console.log(err);
    throw err; // Propagate the error
  }
}

module.exports = {
  findUser,
  Rupiah,
  GetInvoiceData,
  getClaimData,
  getHotlineData,
  FormatTanggal,
};

