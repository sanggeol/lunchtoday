
'use strict'

var request = require('request');

exports.search_test = function(restaurants,resultcallback){

    //37.509815, 127.064187
    var startName = "KCTech"
   
   var startX = 127.064187 
   var startY = 37.509815
    //todo end seires setup below
    //restaurants.location.longitude
    //restaurants.location.latitude
    //restaurants.restaurant_name
    var endName = "명궁"
   
    var endX = 127.064187
    var endY = 37.510214
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

});

}


