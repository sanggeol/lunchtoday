
'use strict'

var GoogleMapsAPI = require('googlemaps')

var publicConfig = {
  key: 'AIzaSyAPKefB_eM0X050XxQLgQBrjX7OQuyP6Oc',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              '' // optional, set a proxy for HTTP requests 
};
var gmAPI = new GoogleMapsAPI(publicConfig);



exports.test = function(){
	var geocodeParams = {
  	"address":    "121, Curtain Road, EC2A 3AD, London UK",
  	"components": "components=country:GB",
  	"bounds":     "55,-1|54,1",
  	"language":   "en",
  	"region":     "uk"
	}

 	gmAPI.geocode(geocodeParams, function(err, result){
    console.log(result);
	})
}