$(document).ready(function() {

// get city input
// var qCity = $('#id-of-some-field').val().trim();
qWxCity = 'Austin';
// set units
var qWxUnits = '&units=imperial';
// todo: who's key is this?
// API key
var qOWAPI = '&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
// OpenWeather query URL
var qWxQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + qWxCity + qWxUnits + qOWAPI;
var qWxFiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + qWxCity + qWxUnits + qOWAPI;

// var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + qUVLat + qUVLon + qOWAPI;
var qUVLon;
var qUVLat;

// todo: add success method
// AJAX call to the OpenWeatherMap API
// $.ajax({
//   url: qWxQueryURL,
//   method: 'GET'
// })
//   // store query wxResponse
//   .then(function(wxResponse) {
//     // Log the queryURL
//     console.log(qWxQueryURL);
//     // Log the resulting object
//     console.log(wxResponse);
//     // Populate HTML with wx response
//     $('.city').text(wxResponse.name);
//     // populate date in header: Day, Month Date
//     var dateToday = moment().format('M/D/YYYY');
//     $("#currentDay").text('(' + dateToday + ')');
//     console.log('icon: ' + wxResponse.weather[0].icon);
//     //http://openweathermap.org/img/wn/10d@2x.png
//     var wxIcon = 'http://openweathermap.org/img/wn/' + wxResponse.weather[0].icon + '.png';
//     $('.icon').attr('src', wxIcon);
//     $('.temp').html('Temperature: ' + wxResponse.main.temp + ' &#8457;');
//     $('.humidity').text('Humidity: ' + wxResponse.main.humidity + ' %');
//     $('.wind').text('Wind Speed: ' + wxResponse.wind.speed + ' MPH');
//     // Log the data in the console as well
//     console.log('Wind Speed: ' + wxResponse.wind.speed);
//     console.log('Humidity: ' + wxResponse.main.humidity);
//     console.log('Temperature (F): ' + wxResponse.main.temp);
//     console.log('lon: ' + wxResponse.coord.lon);
//     console.log('lat: ' + wxResponse.coord.lat);
//     qUVLon = wxResponse.coord.lon;
//     qUVLat = wxResponse.coord.lat;
//   });

//   var qUVAppid = '&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
                  // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
                  // http://api.openweathermap.org/data/2.5/uvi?appid=c3ff54472e40c55c3d6d8d12a0c1bc41&lat=0&lon=0
//   var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
// lon: -97.74
// lat: 30.27
qUVLat = 'lat=' + 30.27;
qUVLon = '&lon=' + -97.74
  var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + qUVLat + qUVLon + qOWAPI;
  // console.log('qUVQueryURL: ' + qUVQueryURL);

//   $.ajax({
//     url: qUVQueryURL,
//     method: 'GET'
//   }).then(function(uvResponse) {
//     console.log('done');
//   });

// ************************
function getCurrentWeather() {
  console.log('running getCurrentWeather()');
  return $.ajax({
      url: qWxQueryURL,
      method: 'GET'      
  }).then(function() {
    console.log('in then of getCurrentWeather()');
  });
}

// todo: need to pass lat lon from getCurrentWeather to getUV
function getUV(data, textStatus, jqXHR) {
  console.log('running getUV()');
  return $.ajax({
      url: qUVQueryURL,
      method: 'GET'
  }).then(function() {
    console.log('in then of getUV()');
  });
}
 
function getFiveDayForecast(data, textStatus, jqXHR) {
  console.log("running getFiveDayForecast()...");
  return $.ajax({
    url: qWxFiveDayForecastURL,
    method: 'GET'
  }).then(function() {
    console.log('in then of getFiveDayForecast()');
  });
}
 
function main() {
  getCurrentWeather().then(getUV).then(getFiveDayForecast);
  console.log('main() done');
}
// ************************

main();

});