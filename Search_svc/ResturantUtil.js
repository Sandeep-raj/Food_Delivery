const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resturantSchema = new Schema({
    dateAdded : String,
    address: String,
    categories : String,
    city : String,
    country: String,
    lat : Number,
    log : Number,
    name : String,
    postal : Number,
    province : String,
    source : String,
    website : String
});

module.exports.resturantSchema = resturantSchema;

module.exports.mongoose = mongoose;
module.exports.resturantModel = mongoose.model('resturants',resturantSchema);
module.exports.mongoConnect = function(mongoose) {
    //connnect to a Database
    mongoose.connect('mongodb://localhost/Resturants', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    //Check if connection is established
    mongoose.connection.once('open', function () {
        console.log('Connection Established');
    }).on('error', function (error) {
        console.log('Connection Error: ' + error);
    });
}