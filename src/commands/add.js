'use strict'

var Restaurants      = require('../models/restaurant')

const _ = require('lodash')
const config = require('../config')
const search = require('../search')
const trending = require('github-trending')

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
  
  search.search_restaurants(restaurant_name,function(err, results){
  	if(err){
  		console.log(err)
  		res.send(500)
  	}else{

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
            	fallback: "Would you recommend it to customers?",
           		title: "Would you recommend it to customers?",
            	callback_id: "add_accept",
            	color: "#3AA3E3",
            	attachment_type: "default",
            	actions: [
                	{
                    	name: "recommend",
                    	text: "Recommend",
                    	type: "button",
                    	value: "recommend"
                	},
               	 	{
                    	name: "no",
                    	text: "No",
                    	type: "button",
                    	value: "bad"
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



  // if(blocks[0]=="add"){    
  //     if(blocks.length == 2 && blocks[0]=="add"){
  //         console.log("ready to create restaurant" + restaurant_name)
	 //  Restaurants.find({restaurant_name: restaurant_name}).exec(function(err, found) {	  
	 //      if(err){
		//   console.log(err)
  //                 res.send(500)    
	 //      }
	 //      else{
		//   if(found.length == 0){		  
		//       create_restaurant(user_name, user_id, team_name, team_id, restaurant_name, function(err,added_restaurant){
		// 	      if(err){
		// 		  console.log(err)
		// 		  res.send(500)
		// 	      }
		// 	      else{
		// 		  added_restaurant.save(function (err) {if (err) console.log ('Error on save!')});
		// 		  console.log("restaurant " + restaurant_name + " saved.")
		// 		  let attachments = [
		// 		  {
		// 		    title: 'Lunch Today!',
		// 		    color: '#2FA44F',
		// 		    text: "restaurant " + restaurant_name + " added",
		// 		    mrkdwn_in: ['text']
		// 		  }]
		// 		  let msg = _.defaults({
		// 		    channel: payload.channel_name,
		// 		    attachments: attachments
		// 		  }, msgDefaults)
		// 		  res.set('content-type', 'application/json')
		// 		  res.status(200).json(msg)
		// 	      }
		//   	})     			  			  
	 //      	  }
  //   	          else{
		//   	  console.log('restaurant ' + restaurant_name + ' is already in the list')
		// 	  let attachments = [
		// 	  {
		// 	    title: 'Lunch Today!',
		// 	    color: '#2FA44F',
		// 	    text: "restaurant " + restaurant_name + " is already in the list",
		// 	    mrkdwn_in: ['text']
		// 	  }]
		// 	  let msg = _.defaults({
		// 	    channel: payload.channel_name,
		// 	    attachments: attachments
		// 	  }, msgDefaults)
		// 	  res.set('content-type', 'application/json')
		// 	  res.status(200).json(msg)	      
	 //          }
	 //      }
	 //  })	            
  //     }
  //     else if(blocks.length < 2){
  //         console.log("restaurant name not supplied")
  //         res.send("restaurant name is needed! See help")
  //     }
  // }
  // else{
  //     console.log("not an add command")
  // }



  return
}

var create_restaurant = function(user_name, user_id, team_name, team_id, restaurant_name, cb){
	Restaurants.create({user_name: user_name,
                  user_id: user_id,
               	  team_name: team_name,
          	  team_id: team_id,
             	  restaurant_name: restaurant_name}, function(err,added_restaurant){
	    if(err){
                cb(err, null)
            }
            else{
                console.log(added_restaurant)
                cb(null, added_restaurant)
            }
	})
}

module.exports = { pattern: /add/ig, handler: handler }

