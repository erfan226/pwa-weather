const express = require('express');
const app = express();
const request = require('request-promise');
const path = require('path');
const myreq = require('request')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

let apiKey = '12663b8a9020c80d9da55b2d7b351f65';
var city;

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/weather', (req, res)=>{
  city = req.query.q;
  console.log("req.query:"+req.query+"\n"+"req.query.q:"+req.query.q+"\ncity: "+city)
  let url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+apiKey
  myreq(url,
  function (err, response, body) {
    if(err){
      console.log('error:', err);
    }else if(city=='' || city==undefined){
      // If no city is given through parameter
      res.redirect('/')
    }else {
      let weatherData = JSON.parse(body)
      var temp = Math.floor(weatherData.main.temp-273)
      res.render('index',{
        city: weatherData.name,
        status: weatherData.weather[0].main,
        temp: temp
      })
    }
  });
})
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {

    console.log( "Listening on " + server_ip_address + ", server_port " + server_port  );

});
// app.listen(3000, () => {
//   console.log('Weather app listening on port 3000!');
// });
