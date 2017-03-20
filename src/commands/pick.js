'use strict'

var Restaurants      = require('../models/restaurant')

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'lunchtoday',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
    console.log('pick handler initiated')
    Restaurants.find({}).exec(function(err, result) {
      if (!err) {
          console.log(result.length + ' restaurants found in the list')
        
        //update weights
          Restaurants.updateWeight(function (err,raw) {
            if (err) console.log(err);
            else{
              
            //calculate probability for each restaurant
              var softmax_probability_unnormalized = []
              var sum_of_softmax = 0
              var C1 = 0.1
              for(var i=0; i<result.length; i++){
                var temp = Math.exp(C1 * result[i].weight)
                console.log("i = " + i + ", weight = " + result[i].weight + ", C1*weight = " + C1*result[i].weight + ", exp(C1*weight) = " + temp)            
                softmax_probability_unnormalized.push(temp);
                sum_of_softmax += temp;
              }
              console.log('softmax unnormalized ' + softmax_probability_unnormalized)
              console.log('sum_of_softmax = ' + sum_of_softmax)
              var softmax_probability = []
              for(i=0; i<result.length; i++){
                softmax_probability.push(softmax_probability_unnormalized[i] / sum_of_softmax)
              }
              console.log('softmax probability ' + softmax_probability)

            //generate random number and pick a restaurant
              var random_number = Math.random()
              var accumulate_prob = 0
              var flag = 0
              var restaurant_picked_number = -1
              for(var i=0; i<result.length; i++){
                accumulate_prob += softmax_probability[i]
                if(flag == 0 && random_number < accumulate_prob){
                  flag = 1
                  restaurant_picked_number = i
                }
              }
              console.log('accumulate_prob = ' + accumulate_prob)
              console.log('restaurant_picked_number = ' + restaurant_picked_number)
              var restaurant_picked = result[restaurant_picked_number]
        
            //compose and send response 
              let attachments = [
              {
                 color: '#2FA44F',
                 image_url: restaurant_picked.image
              },
              {
                  fallback: "Today\'s lunch spot is " + restaurant_picked.restaurant_name + '.  (도보거리 약 ' + Math.round(restaurant_picked.distance.seconds/60)+ ' 분)',           
                  title: 'today\'s lunch spot is...',
                  color: '#2FA44F',
                  text: restaurant_picked.restaurant_name + '   (도보거리 약 ' + Math.round(restaurant_picked.distance.seconds/60)+ ' 분)',
                  mrkdwn_in: ['text']
              }
              ]
              console.log('herehere')
              let msg = _.defaults({
                  channel: payload.channel_name,
                  attachments: attachments
              }, msgDefaults)
              res.set('content-type', 'application/json')
              res.status(200).json(msg)

            }
          })
        
      } else {
          console.log(err)
          res.send(500)
      };
    });
    

    return
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low ) + low);
}



module.exports = { pattern: /pick/ig, handler: handler }
