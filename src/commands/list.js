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
    console.log('list handler initiated')
    Restaurants.find({}).exec(function(err, result) {
      if (!err) {
          console.log('restaurants found in the list')
          res.send(JSON.stringify(result, undefined, 2));
      } else {
          console.log(err)
          res.send(500)
      };
    });
    
    console.log('herehere')
//    let msg = _.defaults({
//      channel: payload.channel_name,
//      attachments: attachments
//    }, msgDefaults)
//    res.set('content-type', 'application/json')
//    res.status(200).json(msg)

    return
}

module.exports = { pattern: /list/ig, handler: handler }
