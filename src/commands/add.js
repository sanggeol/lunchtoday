'use strict'

var Restaurant      = require('../models/restaurant')

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
  var team_name = payload.team_domain
  var team_id = payload.team_id
  var user_name = payload.user_name
  var user_id = payload.user_id

  var text = payload.text
  var blocks = text.split(" ")
      
  if(blocks.length > 2 && blocks[0]=="add"){
      var restaurant_name = blocks[1]
      create_restaurant(user_name, user_id, team_name, team_id, restaurant_name)           
  }

  let attachments = [
  {
    title: 'Lunch Today!',
    color: '#2FA44F',
    text: 'restaurant added',
    mrkdwn_in: ['text']
  }]

  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)

  return
}

var create_restaurant = function(user_name, user_id, team_name, team_id, restaurant_name){
	Restaurant.create({user_name: user_name,
                  user_id: user_id,
               	  team_name: team_name,
          	  team_id: team_id,
             	  restaurant_name: restaurant_name})
}

module.exports = { pattern: /add/ig, handler: handler }

