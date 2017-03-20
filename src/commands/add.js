'use strict'

var Restaurants      = require('../models/restaurant')

const navigation = require('../navigation')

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')


const cancelmsgDefaults = {
  response_type: 'ephemeral',
  username: 'lunchtoday',
  replace_original: true,
  icon_emoji: config('ICON_EMOJI')
}

const msgDefaults = {
  response_type: 'in_channel',
  username: 'lunchtoday',
  replace_original: true,
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload,res_info,res) => {
  console.log("add handler initiated")

  var team_name = payload.team_domain
  var team_id = payload.team_id
  var user_name = payload.user_name
  var user_id = payload.user_id


  //restaurant_info is array [0] = name [1] = latitude [2] = longitude
  var restaurant_info = res_info.split("_")

    
    if(res_info == "Cancel"){
    	let attachments = [
			  	{
			    title: 'Lunch Today!',
			    color: '#2FA44F',
			    text: "취소하셨습니다.",
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

    var restaurant_name = restaurant_info[0]

    console.log("ready to create restaurant" + restaurant_name)

    
	Restaurants.find({restaurant_name: restaurant_name}).exec(function(err, found) {	  
	      if(err){
		 	 console.log(err)
             res.send(500)    
	      }
	      else{
			  if(found.length == 0){		  
			    create_restaurant(user_name, user_id, team_name, team_id, restaurant_info, function(err,added_restaurant){
				    if(err)
				    {
						console.log(err)
					  	res.send(500)
			    	}
			      	else
			      	{
				  		added_restaurant.save(function (err) {if (err) console.log ('Error on save!')});
				  		console.log("restaurant " + restaurant_name + " saved.")
				 
				  		let attachments = [
				 		{
				 		   title: 'Lunch Today!',
				    	   color: '#2FA44F',
				    	   text: "restaurant " + restaurant_name + " added",
				    	   mrkdwn_in: ['text']
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
	      	  }
    	      else{
		  	  	console.log('restaurant ' + restaurant_name + ' is already in the list')
			  	let attachments = [
			  	{
			    title: 'Lunch Today!',
			    color: '#2FA44F',
			    text: "restaurant " + restaurant_name + " is already in the list",
			    mrkdwn_in: ['text']
			  	}]
			  
			  	let msg = _.defaults({
			    channel: payload.channel_name,
			    attachments: attachments
			  	}, msgDefaults)
			  
			  	res.set('content-type', 'application/json')
			  	res.status(200).json(msg)	      
	          }
	      }
	})	            
  return
}

var create_restaurant = function(user_name, user_id, team_name, team_id, restaurant_info, cb){

	 var restaurant_name = restaurant_info[0]

    var latitude = restaurant_info[1]

    var longitude = restaurant_info[2]

    navigation.Get_distance(restaurant_info,function(err, totaltime){
    
    	var minutes = Math.floor(totaltime / 60);
	    var seconds = totaltime - minutes * 60;
    	console.log("time: " + totaltime + "sec")
    	console.log(minutes + "분" + seconds + "초 걸립니다.")

		Restaurants.create({user_name: user_name,
                  user_id: user_id,
               	  team_name: team_name,
          	 	  team_id: team_id,
             	  restaurant_name: restaurant_name,
             	  location: {
             	  	registered: true,
             	  	longitude: longitude,
             	  	latitude: latitude
             	  	},
             	  distance: {
             	  	registered: true,
             	  	min : totaltime
             	  	}
				  }, function(err,added_restaurant){
	    		 	if(err){
                		cb(err, null)
            		}
            		else{
                		console.log(added_restaurant)
                		cb(null, added_restaurant)
            		}
		})
  	})


}

module.exports = { pattern: /create/ig, handler: handler }

