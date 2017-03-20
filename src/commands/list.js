'use strict'

var Restaurants      = require('../models/restaurant')

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'lunchtoday',
  icon_emoji: config('ICON_EMOJI'),
}

const handler = (payload, res) => {
    console.log('list handler initiated')
    Restaurants.find({}).select('restaurant_name -_id').exec(function(err, result) {
      if (!err) {
          console.log(result.length + ' restaurants found in the list')
          var rest_list = ''
          for(var i = 0; i < result.length; i++) {
//             rest_list += JSON.stringify(result[i].restaurant_name, undefined, 2) + '\n'     
            if(result[i].distance.registered == true){
              rest_list += result[i].restaurant_name + '   ' + result[i].distance.min + '분\n'
            }else{
              rest_list += result[i].restaurant_name + '\n'
            }
          }
          rest_list += '### total '+ result.length + ' restaurants listed ###'
//           let attachments = [
//           {
//           title: 'List of restaurants',
//           color: '#2FA44F',
//           text: rest_list,
//           mrkdwn_in: ['text']
//           }]
          let msg = _.defaults({
            channel: payload.channel_name,
//             attachments: attachments,
            text: rest_list
          }, msgDefaults)
          res.set('content-type', 'application/json')
          res.status(200).json(msg)
        
      } else {
          console.log(err)
          res.send(500)
      };
    });
    
    console.log('herehere')


    return
}

module.exports = { pattern: /list/ig, handler: handler }
