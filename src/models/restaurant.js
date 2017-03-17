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
    weight: {type: Number, default: 0},
    location: {
      registered: {type: Boolean, default: false},
      longitude: {type: Number, default: -1},
      latitude: {type: Number, default: -1}
    },
    distance: {
      registered: {type: Boolean, default: false},
      min: {type: Number, default: -1}
    },
    status: {type: String, default: 'listed'}
  },
  { timestamps: true }
);

restaurantSchema.statics.updateWeight = function updateWeight(cb){
  console.log('updateWeight called')
  this.model("Restaurants").find({}).exec(function(err, result){
    if (err) console.log(err)
//     for(var i=0; i<result.length; i++){
//       result[i].update({weight: 0},{}, function(err, cb2){
//         if (err) console.log(err)
//       })
//     }
    result[0].update({weight: 2},{}, function(err, raw){
      console.log('The raw response from Mongo was ', raw);
      cb(err)
    })

  })
  console.log('weights updated')
//   this.model("Restaurants").findOneAndUpdate(query, {weight: 1}, {new: true}, function(err, cb){
//     if (err) console.log(err);
//     console.log("succesfully updated");
//   });  
//   return this.model('Animal').find({ type: this.type }, cb);
}

restaurantSchema.plugin(findOrCreate);

var Restaurants = mongoose.model("Restaurants", restaurantSchema);




// module.exports allows us to pass this to other files when it is called
module.exports = Restaurants;
