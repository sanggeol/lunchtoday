
'use strict'

var Tmp = require('https://apis.skplanetx.com/tmap/js?version=1&format=javascript&appKey=601b6644-8b51-3678-a1e4-b8032baf0540')

var GoogleMapsAPI = require('googlemaps')

var publicConfig = {
  key: 'AIzaSyAPKefB_eM0X050XxQLgQBrjX7OQuyP6Oc',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              '' // optional, set a proxy for HTTP requests 
};
var gmAPI = new GoogleMapsAPI(publicConfig);



exports.test = function(resultcallback){
	var geocodeParams = {
  	"address":    "121, Curtain Road, EC2A 3AD, London UK",
  	"components": "components=country:GB",
  	"bounds":     "55,-1|54,1",
  	"language":   "en",
  	"region":     "uk"
	}

 	gmAPI.geocode(geocodeParams, function(err, result){
    resultcallback(err,result)
	})
}

exports.directions_test = function(resultcallback){
 var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'driving',
        traffic_model: 'pessimistic'
      }
      gmAPI.directions( params, function(err, result) {
        console.log("err: " + err )
        console.log("R : " + result) 
      resultcallback(err,result)
      })

}