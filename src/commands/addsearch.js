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
    var encoded_restaurants_name = encodeURIComponent(restaurants_name); 
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
          var search_results = JSON.parse(results)

          var total_count = search_results.channel.info.totalCount

          let attachments = [
          {
            title: 'Lunch Today!',
            color: '#2FA44F',
            text: "Get: " + total_count + "restaurants",
            mrkdwn_in: ['text']
          },
          {   
              
              fallback: "rihgt?",
              title: "이곳이 맞습니까?",
              callback_id: "add_accept",
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
        ]
      
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

