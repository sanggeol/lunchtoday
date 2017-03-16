
'use strict'

var request = require('request');

var GoogleMapsAPI = require('googlemaps')

var publicConfig = {
  key: 'AIzaSyAPKefB_eM0X050XxQLgQBrjX7OQuyP6Oc',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              '' // optional, set a proxy for HTTP requests 
};
var gmAPI = new GoogleMapsAPI(publicConfig);

exports.tmap_test = function(resultcallback){

    var startX = 14129105.461214
    var startY = 4517042.1926406
    var endX = 14136027.789587
    var endY = 4517572.4745242
    var urlStr = "https://apis.skplanetx.com/tmap/routes?version=1&format=json"
    urlStr += "&startX="+startX
    urlStr += "&startY="+startY
    urlStr += "&endX="+endX
    urlStr += "&endY="+endY
    urlStr += "&appKey=601b6644-8b51-3678-a1e4-b8032baf0540"
    request(urlStr, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred 
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    console.log('body:', body); // Print the HTML for the Google homepage. 
});

}


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