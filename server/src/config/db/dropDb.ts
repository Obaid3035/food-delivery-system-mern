import mongoose from "mongoose";

const url = "mongodb://localhost/snakrs"
mongoose.connect(url, (err) => {
    if (!err) {
        console.log("DB CONNECTED")
        mongoose.connection.db.dropDatabase().then(() => {
            console.log("DB DROPPED")
            mongoose.disconnect().then(() => {
                console.log("DB DISCONNECTED")
            })
        })
    } else {
        console.log(err)
    }
})
