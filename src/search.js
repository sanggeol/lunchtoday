
'use strict'

var request = require('request');

exports.search_test = function(restaurants_name,resultcallback){
  
   var originName = "KCTech"
   var originX = 127.064187 
   var originY = 37.509815
 
   var radius = 3000  
 
    var urlStr = "https://apis.daum.net/local/v1/search/keyword.json?apikey=17ebd26a167e3d81a1d75ce9608f5b7a"
    urlStr += "&query=" + restaurants_name  
    urlStr += "&location=" + originY + "," + originX
    urlStr += "&radius=" + radius

    console.log(urlStr)
    request(urlStr, function (err, response, body) {
      //using response
      console.log('error:', error); // Print the error if one occurred 
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
      console.log('body:', body); // Print the HTML for the Google homepage. 
      
      resultcallback(err,body)
    })

}


