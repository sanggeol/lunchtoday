
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Lunchtoday will pick a lunch spot for you!',
    color: '#2FA44F',
    text: '`/lunch` returns a lunch restaurant. Don/'t worry. You don/'t have to choose!  \n`/lunch list` returns list of all lunch restaurants.',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring Lunchtoday',
    color: '#E3E4E6',
    text: '`/lunch help` ... you\'re lookin at it! \n`/lunch add A` adds a new restaurant A to the list. \n`/lunch remove A` removes restaurant A from the list',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }
