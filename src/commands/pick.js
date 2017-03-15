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
    console.log('pick handler initiated')
    Restaurants.find({}).select('restaurant_name -_id').exec(function(err, result) {
      if (!err) {
          console.log(result.length + ' restaurants found in the list')
          var restaurant_picked_number = 0
          var restaurant_picked = result[restaurant_picked_number]
        
          let attachments = [
          {
              title: 'today\'s lunch spot is...',
              color: '#2FA44F',
              text: restaurant_picked.restaurant_name,
              mrkdwn_in: ['text']
          },
          ]
          console.log('herehere')
          let msg = _.defaults({
              channel: payload.channel_name,
              attachments: attachments
          }, msgDefaults)
          res.set('content-type', 'application/json')
          res.status(200).json(msg)

      } else {
          console.log(err)
          res.send(500)
      };
    });
    

    return
}

module.exports = { pattern: /pick/ig, handler: handler }
