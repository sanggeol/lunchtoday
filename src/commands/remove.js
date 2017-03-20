'use strict'

var Restaurants      = require('../models/restaurant')

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
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
  
  console.log("restaurant name is " + restaurant_name)
  
  if(blocks[0]=="remove" && blocks.length > 1 ){    

    Restaurants.find({restaurant_name: /.*restaurant_name.*/i }).remove(
      function(err, removed) {
        
      
        var result_msg = " 이 목록에서 제거되었습니다."
        
        if(removed.length == 0){
          result_msg = "은(는) 목록에 존재하지 않습니다."
        }
        
       let attachments = [
        {
          title: 'Lunch Today!',
          color: '#2FA44F',
          text: restaurant_name + result_msg ,
         mrkdwn_in: ['text']
        }]
        let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
        }, msgDefaults)
        res.set('content-type', 'application/json')
        res.status(200).json(msg)
      });
  }
  else{
      console.log("not an remove command")
  }

  return
}


module.exports = { pattern: /remove/ig, handler: handler }

