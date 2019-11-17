// todos
// * Create multiple functions within your application to handle the different parts of the dashboard:
//      [ ] Current conditions
//      [ ] 5-Day Forecast
//      [ ] Search history
//      [ ] UV index
// [ ] You will need to make more than one AJAX call. see .done or .then
// [ ] You will need to hardcode some of the parameters in the API's URL. User input will determine some of the other parameters.
// [ ] Use `localStorage` to store any persistent data.
// [ ] Application loads last searched city forecast on page load.
// [ ] Use the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to add the user's current location to the initial landing page.

// ************************
    // get some inputs
    // var qTerm = $('#searchTermInput').val().trim();
    // var startYear = $('#startYearInput').val();
    // var qStartYear = (startYear) ? '&begin_date=' + startYear + '0101' : '' ;    
    // var endYear = $('#endYearInput').val();    
    // var qEndYear = (endYear) ? '&end_date=' + endYear + '1231' : '' ;
    // var qApiKey = '&api-key=qAiGunHgKFuGjuEOhP1Um0VVMZ6NOqcn';

    // //store api url
    // var queryURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ qTerm + qStartYear + qEndYear + qApiKey;
// ************************

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

var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + qUVLat + qUVLon + qOWAPI;
var qUVLon;
var qUVLat;

// todo: add success method
// AJAX call to the OpenWeatherMap API
$.ajax({
  url: qWxQueryURL,
  method: 'GET'
})
  // store query wxResponse
  .then(function(wxResponse) {
    // Log the queryURL
    console.log(qWxQueryURL);
    // Log the resulting object
    console.log(wxResponse);
    // Populate HTML with wx response
    $('.city').text(wxResponse.name);
    // populate date in header: Day, Month Date
    var dateToday = moment().format('M/D/YYYY');
    $("#currentDay").text('(' + dateToday + ')');
    console.log('icon: ' + wxResponse.weather[0].icon);
    //http://openweathermap.org/img/wn/10d@2x.png
    var wxIcon = 'http://openweathermap.org/img/wn/' + wxResponse.weather[0].icon + '@2x.png';
    $('.icon').attr('src', wxIcon);
    $('.temp').html('Temperature: ' + wxResponse.main.temp + ' &#8457;');
    $('.humidity').text('Humidity: ' + wxResponse.main.humidity + ' %');
    $('.wind').text('Wind Speed: ' + wxResponse.wind.speed + ' MPH');
    // Log the data in the console as well
    console.log('Wind Speed: ' + wxResponse.wind.speed);
    console.log('Humidity: ' + wxResponse.main.humidity);
    console.log('Temperature (F): ' + wxResponse.main.temp);
    console.log('lon: ' + wxResponse.coord.lon);
    console.log('lat: ' + wxResponse.coord.lat);
    qUVLon = wxResponse.coord.lon;
    qUVLat = wxResponse.coord.lat;
  },
  console.log('hi'));

//   var qUVAppid = '&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
                  // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
                  // http://api.openweathermap.org/data/2.5/uvi?appid=c3ff54472e40c55c3d6d8d12a0c1bc41&lat=0&lon=0
//   var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
// lon: -97.74
// lat: 30.27
  var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + qUVLat + qUVLon + qOWAPI;

//   $.ajax({
//     url: qUVQueryURL,
//     method: 'GET'
//   }).then(function(uvResponse) {
//     console.log('done');
//   });

// ************************
function getCurrentWeather() {
    return $.ajax({
        url: qWxQueryURL,
        method: 'GET'      
    });
 }
 
 function getUV(data, textStatus, jqXHR) {
    return $.ajax({
        url: qUVQueryURL,
        method: 'GET'
    });
 }
 
 function getFiveDayForecast(data, textStatus, jqXHR) {
     console.log("todo: implement getFiveDayForecast()...");
    // return $.ajax(...);
 }
 
 function main() {
    getCurrentWeather().then(getUV).then(getFiveDayForecast);
 }
// ************************

main();