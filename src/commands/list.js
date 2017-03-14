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
  trending('javascript', (err, repos) => {
    if (err) throw err

//     var attachments = repos.slice(0, 5).map((repo) => {
//       return {
//         title: `${repo.owner}/${repo.title} `,
//         title_link: repo.url,
//         text: `_${repo.description}_\n${repo.language} • ${repo.star}>`,
//         mrkdwn_in: ['text', 'pretext']
//       }
//     })
    Restaurants.find({}).exec(function(err, result) {
      if (!err) {
          res.send(JSON.stringify(result, undefined, 2));
      } else {
          console.log(err)
          res.send(500)
      };
    });
    
//    let msg = _.defaults({
//      channel: payload.channel_name,
//      attachments: attachments
//    }, msgDefaults)

//    res.set('content-type', 'application/json')
//    res.status(200).json(msg)
    return
  })
}

module.exports = { pattern: /list/ig, handler: handler }
