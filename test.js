const { Claim, Hotline } = require("./config/database");

async function Main(input) {
  try {
    const res = await Claim.findOne({
      where: {
        Input: input,
      },
    });
    console.log(res.dataValues);
  } catch (err) {
    console.log(err);
  }
}
Main("C3/5200021928/98067-86871");
