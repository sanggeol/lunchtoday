
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')
const commands = require('./commands')

const navigation = require('./navigation')
const search = require('./search')


const defaultCommand = require('./commands/pick')

let bot = require('./bot')

let app = express()

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.post('/commands/starbot', (req, res) => {
  let payload = req.body

  if (!payload || payload.token !== config('STARBOT_COMMAND_TOKEN')) {
    let err = '✋  Star—what? An invalid slash token was provided\n' +
              '   Is your Slack slash token correctly configured?'
    console.log(err)
    res.status(401).end(err)
    return
  }

  //return current time GMT 0   
  var c_date = new Date()
  var hours = c_date.getHours()
  console.log(hours)
  //서울시간(GMT 9 으로 변경하기 위해 9를 더해야함 )
  hours += 9
  if(hours >= 24){
    hours -= 24
  }
  console.log(hours + ": Seoul")

  // navigation.tmap_test(null,function(err, totaltime){
    
  //   var minutes = Math.floor(totaltime / 60);

  //   var seconds = totaltime - minutes * 60;

  //   console.log("time: " + totaltime + "sec")
  //   console.log(minutes + "분" + seconds + "초 걸립니다.")

  // })

  search.search_test("명궁",function(err,result){
    if(err){
      console.log("err" + err)
    }else{
      var results = JSON.parse(result)
      console.log("search result: "+ results)
    }
  })


  
  //todo check
  //today history
  // if(payload.text == "" && ( hours < 11 || hours > 13 ) )
  // {
  //      res.end("죄송합니다. 영업시간이 아닙니다.")
  //      return
  // }
      
  console.log(payload)
  let cmd = _.reduce(commands, (a, cmd) => {
            return payload.text.match(cmd.pattern) ? cmd : a
            }, defaultCommand)
  
  cmd.handler(payload, res)
 })

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Lunchtoday LIVES on PORT ${config('PORT')} 🚀`)

  if (config('SLACK_TOKEN')) {
    console.log(`🤖  beep boop: @lunchtoday is real-time\n`)
    bot.listen({ token: config('SLACK_TOKEN') })
  }
})
