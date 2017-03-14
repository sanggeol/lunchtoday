// grab the mongoose module
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/lunchtoday');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected!")
});

//and the plugin
var findOrCreate = require('mongoose-findorcreate')

// define our user model
var restaurantSchema = new mongoose.Schema({
    team_name: {type: String, default: ''},
    team_id: {type: String, default: ''},
    user_name: {type: String, default: ''}, //sender of the restaurant
    user_id: {type: String, default: ''},   //sender of the restaurant
    restaurant_name: {type: String, default: ''},
    status: {type: String, default: 'listed'}
  },
  { timestamps: true }
);

restaurantSchema.plugin(findOrCreate);

var Restaurants = mongoose.model("Restaurants", restaurantSchema);

// module.exports allows us to pass this to other files when it is called
module.exports = Restaurants;
