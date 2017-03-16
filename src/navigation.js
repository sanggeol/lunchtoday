
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

exports.tmap_test = function(restaurants,resultcallback){

    //37.509815, 127.064187
    var startName = "KCTech"
    var startX = 37.509815
    var startY = 127.064187


    //37.510214, 127.064700
    //todo end seires setup below
    //restaurants.location.longitude
    //restaurants.location.latitude
    //restaurants.restaurant_name
    var endName = "명궁"
    var endX = 37.510214
    var endY = 127.064187
    var urlStr = "https://apis.skplanetx.com/tmap/routes/pedestrian?version=1&format=json"
    urlStr += "&startX="+startX
    urlStr += "&startY="+startY
    urlStr += "&endX="+endX
    urlStr += "&endY="+endY
    urlStr += "&startName="+ startName
    urlStr += "&endName="+ endName
    urlStr += "&appKey=601b6644-8b51-3678-a1e4-b8032baf0540"
    request(urlStr, function (error, response, body) {
      //total distance 미터
      //total time : 초
      var totaltime
      if(err){
        totaltime = -1
      }else{
         var routes = JSON.parse(body)
         totaltime = routes.features[0].properties.totalTime
      }
    resultcallback(err,totaltime)

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