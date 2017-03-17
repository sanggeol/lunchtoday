'use strict'


const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

var request = require('request');
var Restaurants      = require('../models/restaurant')


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

          var attach_cnt = 3
          if(total_count < 3){
              attach_cnt = total_count
          }

          let attachments = []

          /*
          "fields": [
                {
                    "title": "Volume",
                    "value": "1",
                    "short": true
                },
                {
                    "title": "Issue",
                    "value": "3",
            "short": true
                }
            ],
            "author_name": "Stanford S. Strickland",
            "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/bfaba/img/api/homepage_custom_integrations-2x.png",
            "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
          */
          for (var i = 0; i < attach_cnt; i++)
          {
            var search_item = search_results.channel.item[i]

            var result_msg = 
            {
              title: search_item.title,    
              color: '#2FA44F',
              image_url: search_item.imageUrl,
              text: "거리: " + search_item.distance + "m",
              mrkdwn_in: ['text'],
              fallback: "rihgt?",
              title: "이곳이 맞습니까?",
              callback_id: "add_accept_" + i,
              color: "#3AA3E3",
              attachment_type: "default",
              actions: [
                {
                    name: "yes",
                    text: "Yes",
                    type: "button",
                    value: "right"
                },
                {
                    name: "no",
                    text: "No",
                    type: "button",
                    value: "isnot"
                }
              ]
            }

            attachments.push(result_msg)
          }
              
         let msg = _.defaults({
            channel: payload.channel_name,
            attachments: attachments
            }, msgDefaults) 
          res.set('content-type', 'application/json')
          res.status(200).json(msg)           
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

module.exports = { pattern: /add/ig, handler: handler }

