const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const {
	Main,
	sendFonnte,
	getAllstatus,
	InvoiceHandler,
	ClaimHandler,
	HotlineHandler,
} = require("./model");
const { findUser , FormatTanggal} = require("./controller/controller");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.get("/", (reg, res) => {
	res.status(200).send("ok");
});
app.use(express.static("public"));

function stringifyData(data) {
	const stringifiedItems = data
		.map((item) => ` Menu: ${item.Menu} Total: ${item.Total} `)
		.join("\n");
	return `${stringifiedItems}`;
}
// Handle POST requests to /processData
app.post("/", async (req, res) => {
	const data = req.body;
	const { device, sender, message, name, location, url, filename, extension } =
		data;

	if (message.toLowerCase().includes("cek")) {
		findUser(sender, 1);
		let id_Barang = message.trim().split(" ").slice(-1)[0];
		Main(id_Barang, res, sender);
	} else if (message.toLowerCase().includes("inv")) {
		findUser(sender, 2);
		//panggil invoice handler dari Model
		const key_value = message.trim().split(" ");
		const data = {
			Kode: key_value[key_value.length - 2],
			Tgl: new Date(key_value[key_value.length - 1]),
		};
		try {
			InvoiceHandler(data, res, sender);
		} catch (err) {
			console.error("Error handling request:", error.message);
			res.status(500).json({ error: "Internal server error" });
		}
	} else if (message.toLowerCase().includes("c3")) {
		findUser(sender, 3);
		let id_Claim = message.trim().split("/").slice(-2)[0] + "/" + message.trim().split("/").slice(-1)[0]
		ClaimHandler(id_Claim, res, sender);
	} else if (message.toLowerCase().includes("htl")) {
		findUser(sender, 4);
		let id_Claim = message.trim().split(" ").slice(-1)[0];
		HotlineHandler(id_Claim, res, sender);
	} else if (message.toLowerCase().includes("help") &&  message.toLowerCase().includes("1")){
		try {
			sendFonnte(sender, {
				message: "Untuk cek stok ikutin tutorial diatas ya kakak!",
				url: "https://catherine-hso-kaltim-2.online/CekStok.png",
				filename: "Tutorial Cek Stock",
			});
			res.status(200).send("ok");
		} catch (err) {
			console.error(err);
		}
	} else if (message.toLowerCase().includes("help") && message.toLowerCase().includes("2")) {
		try {
			sendFonnte(sender, {
				message: "Untuk Mencetak invoice ikutin tutorial diatas ya kakak!",
				url: "https://catherine-hso-kaltim-2.online/Inv.png",
				filename: "Tutorial Cetak Invoice",
			});
			res.status(200).send("ok");
		} catch (err) {
			console.error(err);
		}
	} else if (message.toLowerCase().includes("help") && message.toLowerCase().includes("3")) {
		try {
			sendFonnte(sender, {
				message: "Untuk mengecek claim ikutin tutorial diatas ya kakak!",
				url: "https://catherine-hso-kaltim-2.online/Claim.png",
				filename: "Tutorial Claim",
			});
			res.status(200).send("ok");
		} catch (err) {
			console.error(err);
		}
	} else if (message.toLowerCase().includes("help") && message.toLowerCase().includes("4")) {
		try {
			sendFonnte(sender, {
				message: "Untuk mengecek hotline ikutin tutorial diatas ya kakak!",
				url: "https://catherine-hso-kaltim-2.online/Htl.png",
				filename: "Tutorial Hotline",
			});
			res.status(200).send("ok");
		} catch (err) {
			console.log(err);
		}
	} else if (message === "!Dashboard") {
		try {
			const pesan = await getAllstatus().then((data) => {
				const message = stringifyData(data);
				return message;
			});
			const fonnteResponse = await sendFonnte(sender, {
				message: pesan,
			});
			res.status(200).send("ok");
		} catch (error) {
			console.error("Error handling request:", error.message);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		try {
			const fonnteResponse = await sendFonnte(sender, {
				message:
'*Pesan Otomatis*\nHalo. Salam Satu Hati. \nCATHERINE bisa bantu apa hari ini?\n1. Cek Stok (ketik "cek Part Number" tanpa menggunakan “-”)\n2. Cek Rincian Pesanan (ketik "inv Kode Dealer/Toko Tahun-Bulan-Tanggal")\n3. Lacak Pengajuan Claim Sparepart (ketik "C3 Nomor Dealer/Toko Part Number")\n4. Cek Hotline Order (ketik "htl  Nomor PO Hotline")\n5. Cek Part Number\n\nNoted : Jika Catherine tidak membalas bisa mengetik *Help* Nomor Menu (Contoh: Help 1)',
      });
      res.status(200).json(fonnteResponse);
    } catch (error) {
      console.error("Error handling request:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

