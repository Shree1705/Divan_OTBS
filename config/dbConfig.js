const mongoose = require("mongoose");

// mongoose.connect('mongodb+srv://dssvatsa1705:Dss1705@cluster0.t0jo5fv.mongodb.net/?retryWrites=true&w=majority');

// const db = mongoose.connection;


mongoose.connect('mongodb+srv://dssvatsa1705:Dss1705@cluster0.t0jo5fv.mongodb.net/bus-booking')
    .then(res => {
        console.log(`Database connected`);
    })
    .catch(err => console.log(err))
// db.on("connected", () => {
//   console.log("Mongo Db Connection Successfull");
// });

// db.on("error", () => {
//   console.log("Mongo Db Connection Failed");
// });
