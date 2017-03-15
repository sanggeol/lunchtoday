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

    Restaurants.remove({restaurant_name: restaurant_name},
      function(err, result) {
      if(err) {
      // 에러 throw
        console.log("nothing.")
      }
       let attachments = [
        {
          title: 'Lunch Today!',
          color: '#2FA44F',
          text: "Remove restaurant : " + restaurant_name,
         mrkdwn_in: ['text']
        }]
        let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
        }, msgDefaults)
        res.set('content-type', 'application/json')
        res.status(200).json(msg)
       // 삭제 후 행동
      });
  }
  else{
      console.log("not an remove command")
  }

  return
}


module.exports = { pattern: /remove/ig, handler: handler }

