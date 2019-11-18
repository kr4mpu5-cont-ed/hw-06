$(document).ready(function() {

// todo: implement get city input
// todo: remove example: var qCity = $('#id-of-some-field').val().trim();
  var qWxCity = '&q=Austin';
// set units
  var qWxUnits = '&units=imperial';
// API key
  var qOWAPI = '&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';
// OpenWeather query URLs
  var qWxQueryURL = 'https://api.openweathermap.org/data/2.5/weather?' + qWxCity + qWxUnits + qOWAPI;
  // qUVQueryURL needs lat/long from getCurrentWeather() for valid request
  var qUVQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + qOWAPI;
  // returned by getCurrentWeather()
  var qUVLon;
  var qUVLat;
  var qWxFiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?' + qWxCity + qWxUnits + qOWAPI;

function getCurrentWeather() {
  return $.ajax({
      url: qWxQueryURL,
      method: 'GET'      
  }).then(function(wxResponse) {
    // Log the queryURL
    // Log the resulting object
    // Populate HTML with wx response
    $('.city').text(wxResponse.name);
    // populate date in header: Day, Month Date
    var dateToday = moment().format('M/D/YYYY');
    $("#currentDay").text('(' + dateToday + ')');
    //http://openweathermap.org/img/wn/10d@2x.png
    var wxIcon = 'http://openweathermap.org/img/wn/' + wxResponse.weather[0].icon + '.png'; // todo: more elegant method than assuming 0th index?
    var wxIconAlt = wxResponse.weather[0].main;
    $('.icon').attr('src', wxIcon);
    $('.icon').attr('alt', wxIconAlt);
    $('.temp').html('Temperature: ' + wxResponse.main.temp + ' &#8457;');
    $('.humidity').text('Humidity: ' + wxResponse.main.humidity + ' %');
    $('.wind').text('Wind Speed: ' + wxResponse.wind.speed + ' MPH');
    // set for getUV()
    qUVLon = '&lon=' + wxResponse.coord.lon;
    qUVLat = '&lat=' + wxResponse.coord.lat;
    qUVQueryURL += ('' + qUVLat + qUVLon);
  });
}

function getUV() {
  return $.ajax({
      url: qUVQueryURL,
      method: 'GET'
  }).then(function(uvResponse) {
    var uvIndex = uvResponse.value;
    var strUVIndex = getUVIndexColor(uvIndex);
    $('.uv').html('UV Index: ' + '<button class="btn" style="background-color: ' + strUVIndex + '; font-size: 1.1em; font-weight: bold">' + uvIndex + '</button>');
  });
}

function getUVIndexColor(int) {
  // https://en.wikipedia.org/wiki/Ultraviolet_index
  var strUVIndex = int;
  switch (true) {
    case (strUVIndex >= 0 && strUVIndex <= 2.9) :
      return '#5DA541'; // return green, low
    case (strUVIndex >= 3.0 && strUVIndex <= 5.9) :
      return '#FDF451'; // return yellow, moderate
    case (strUVIndex >= 6.0 && strUVIndex <= 7.9) :
      return '#E39034'; // return orange, high
    case (strUVIndex >= 8.0 && strUVIndex <= 10.9) :
      return '#D34427'; // return red, very high
    case (strUVIndex >= 11) :
      return '#AB6BA1'; // return violet, extreme
    default : 
      return; // UV Index not available >> no color returned
  }
}

function getFiveDayForecast() {
  // oof! openweatherapi returns 40 items in array, i'm using the '3PMs'
  //    convert unix dt to utc to local
  //    var getUTCTimeFromUnixDT = moment.unix(1574100000).utc().toDate();
  //    var local = moment(getUTCTimeFromUnixDT).local().format('YYYY-MM-DD HH:mm:ss');
  // which are the 3PMs? 7th, then 8 apart; i = 5, 13, 21, 29, 37 (ugh! magic numbers!)
  // todo: implememnt functionality allowing return of 3PM forecast regardless of location/timezone

  return $.ajax({
    url: qWxFiveDayForecastURL,
    method: 'GET'
  }).then(function(fiveDayResponse) {
    var subFiveDayResp = fiveDayResponse.list;
      subFiveDayResp.splice(38);
      subFiveDayResp.splice(30,7);
      subFiveDayResp.splice(22,7);
      subFiveDayResp.splice(14,7);
      subFiveDayResp.splice(6,7);
      subFiveDayResp.splice(0,5);
      console.log(subFiveDayResp);
    var wxCard = "";
    for (i = 0; i < subFiveDayResp.length; i++ ) {
      var wxCardTime = moment(moment.unix(subFiveDayResp[i].dt).utc().toDate()).format('M/D/YYYY'); //format('M/D/YYYY')
      // var wxCardTime = 'M/D/YYYY';
      var wxCardIcon = subFiveDayResp[i].weather[0].icon; // todo: more elegant method than assuming 0th index?
      var wcCardIconAlt = subFiveDayResp[i].weather[0].main;
      wxCard += `<div class="card bg-primary text-white">
        <div class="card-body">
          <h5 class="card-title">${wxCardTime}</h5>
          <p class="card-text">
            <img src="http://openweathermap.org/img/wn/${wxCardIcon}.png" alt="${wcCardIconAlt}" /><br/>
            Temp: ${subFiveDayResp[i].main.temp} &#8457;<br/>
            Humidity: ${subFiveDayResp[i].main.humidity} %<br/>
          </p>
        </div>
      </div>`;

    }

    $("#wxCards").append(wxCard);

  });
  
}
 
function main() {
  getCurrentWeather().then(getUV).then(getFiveDayForecast);
}

main();

});