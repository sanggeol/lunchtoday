
'use strict'

var request = require('request');

var GoogleMapsAPI = require('googlemaps')

//AIzaSyBJ23W-OJvknLM6s-TC29G6TBZENjIVgGY
var publicConfig = {
  key: 'AIzaSyBJ23W-OJvknLM6s-TC29G6TBZENjIVgGY',
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              '' // optional, set a proxy for HTTP requests 
};
var gmAPI = new GoogleMapsAPI(publicConfig);

exports.Get_distance = function(restaurant_info,resultcallback){

    //37.509815, 127.064187
    var startName = "KCTech"
   
   var startX = 127.064187 
   var startY = 37.509815
    //todo end seires setup below
    //restaurants.location.longitude
    //restaurants.location.latitude
    //restaurants.restaurant_name
    var endName = "temp"
    var endY = restaurant_info[1]
    var endX = restaurant_info[2]

    var urlStr = "https://apis.skplanetx.com/tmap/routes/pedestrian?version=1&format=json"
    
    urlStr += "&reqCoordType=WGS84GEO"
    urlStr += "&startX="+startX
    urlStr += "&startY="+startY
    urlStr += "&endX="+endX
    urlStr += "&endY="+endY
    urlStr += "&startName="+ startName
    urlStr += "&endName="+ endName
    urlStr += "&appKey=601b6644-8b51-3678-a1e4-b8032baf0540"
    request(urlStr, function (err, response, body) {
      //total distance 미터
      //total time : 초
      var totaltime
      if(err){
        console.log("error: " + err)
        totaltime = -1
      }else{
         var routes = JSON.parse(body)
         totaltime = routes.features[0].properties.totalTime
      }
    resultcallback(err,totaltime)

    })
}
var params = {
  center: '37.509815,127.064187',
  zoom: 15,
  size: '500x400',
  maptype: 'roadmap',
  style: [
    {
      feature: 'road',
      element: 'all',
      rules: {
        hue: '0x00ff00'
      }
    }
  ]
}
exports.Test_StaticMap = function(mapcallback){
  console.log("Test_StaticMap execute")
  var testurl = gmAPI.staticMap(params) // return static map URL 
  console.log(testurl)
  gmAPI.staticMap(params, function(err, binaryImage) {
    mapcallback(err,binaryImage)
  // fetch asynchronously the binary image 
  })
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