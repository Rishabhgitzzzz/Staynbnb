const mongoose = require('mongoose');
const SData = require("./data.js")
const Listing = require("../models/listing.js");


main().then((res) => {
    console.log("DB Connected ");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/staynbnb');
}

const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(SData.data);
    console.log("sample data inserted check your Db");
};

initDb();