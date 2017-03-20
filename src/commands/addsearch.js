'use strict'


const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

var request = require('request');
var Restaurants      = require('../models/restaurant')


//about google maps
var GoogleMapsAPI = require('googlemaps')

var publicConfig = {
  key: 'AIzaSyBJ23W-OJvknLM6s-TC29G6TBZENjIVgGY',
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              '' // optional, set a proxy for HTTP requests 
};

var gmAPI = new GoogleMapsAPI(publicConfig);


const msgDefaults = {
  response_type: 'ephemeral',
  username: 'lunchtoday',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
  console.log("add handler initiated")

  var team_name = payload.team_domain
  var team_id = payload.team_id
  var user_name = payload.user_name
  var user_id = payload.user_id

  var text = payload.text
  var blocks = text.split(" ")
  
  var restaurant_name = blocks[1]
  
  if(restaurant_name.length > 0){
    var encoded_restaurants_name = encodeURIComponent(restaurant_name); 
    var originName = "KCTech"
    var originX = 127.064187 
    var originY = 37.509815
 
    var radius = 3000  
 
    var urlStr = "https://apis.daum.net/local/v1/search/keyword.json?apikey=17ebd26a167e3d81a1d75ce9608f5b7a"
    urlStr += "&query=" + encoded_restaurants_name  
    urlStr += "&location=" + originY + "," + originX
    urlStr += "&radius=" + radius
    console.log(urlStr)

    request(urlStr, function (err, response, body) {
      //using response    
       if(err){
          console.log(err)
          res.send(500)
        }
        else{
          var search_results = JSON.parse(body)


          var total_count = search_results.channel.info.totalCount

          if(total_count == 0){
              let attachments = [
              {
                title: 'Lunch Today!',
                color: '#2FA44F',
                text: "검색되지 않았습니다. 다시 확인해주세요.",
                mrkdwn_in: ['text']
               }]
          
              let msg = _.defaults({
                  channel: payload.channel_name,
                  attachments: attachments
                  }, msgDefaults)
            
            res.set('content-type', 'application/json')
            res.status(200).json(msg)
          }else{   
            var attach_cnt = 5
            
            if(total_count < attach_cnt ){
                attach_cnt = total_count
            }
            //create google static maps
            var markers = []

            for (var i = 0; i < attach_cnt; i++)
            {
                var search_item = search_results.channel.item[i]
                
                var marker = 
                {
                  location: search_item.latitude +","+ search_item.longitude,
                  label   : nextChar('A',i),
                  color   : 'green',
                  shadow  : true
                }
                markers.push(marker)
            }        
            console.log(markers)
            //center == kctech 
            var map_param = {
             center: '37.509815,127.064187',
             zoom: 15,
             size: '500x400',
             maptype: 'roadmap',
             markers: markers,
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

            var staticmap_url = gmAPI.staticMap(map_param) // return static map URL 
            let attachments = []

            let fileds = []
            
            let actions = []
            //add filed or actions
            for (var i = 0; i < attach_cnt; i++)
            {
              var search_item = search_results.channel.item[i]
              
              var filed =  
              {
                title: nextChar('A',i),
                value: search_item.title + "(" + search_item.distance+" m)",
                short: true
              }
              fileds.push(filed)
              
              var action = 
              {
                name: search_item.title+ "_" + search_item.latitude + "_" + search_item.longitude,
                text: nextChar('A',i),
                type: "button",
                value: "right"
              }
              actions.push(action)
            }            

            var cancle_action =
            {
                name: "cancle",
                text: "cancle",
                type: "button",
                value: "no"
            }
            actions.push(cancle_action)
         
            var main_attach = 
            {
              title: restaurant_name + "검색결과.",
              color: '#2FA44F',
              image_url: staticmap_url,
              fileds: fileds,
              mrkdwn_in: ['text'],
              attachment_type: "default"
            }
            attachments.push(main_attch)

            var action_attach = 
            {
                fallback: "rihgt?",
                callback_id: "select",
                color: "#3AA3E3",
                attachment_type: "default",
                actions: actions
            }
            attachments.push(action_attach)
           
              
            let msg = _.defaults({
              channel: payload.channel_name,
              attachments: attachments
              }, msgDefaults)   
            
            res.set('content-type', 'application/json')
            res.status(200).json(msg)         
            }  
          }
        })
  }else{
    let attachments = [
          {
            title: 'Lunch Today!',
            color: '#2FA44F',
            text: "restaurant name is empty",
            mrkdwn_in: ['text']
          }]

    let msg = _.defaults({
          channel: payload.channel_name,
          attachments: attachments
          }, msgDefaults)
    res.set('content-type', 'application/json')
    res.status(200).json(msg)
  }



  return
}

function nextChar(c,i) {
    return String.fromCharCode(c.charCodeAt(0) + i);
}

module.exports = { pattern: /add/ig, handler: handler }

