$(document).ready(function() {

// set up vars
var wxCity;
var qWxCity;
// set units
var qWxUnits = '&units=imperial';;
// API key
var qOWAPI = '&appid=c3ff54472e40c55c3d6d8d12a0c1bc41';;
var qWxQueryURL;
var qUVQueryURL;
var qUVLon;
var qUVLat;
var qWxFiveDayForecastURL;

$('#search').click(function(event) {
  event.preventDefault();
  wxCity = $('#city').val().trim();
  qWxCity = '&q=' + wxCity;
  console.log(qWxCity);

  // OpenWeather query URLs
  qWxQueryURL = setWxQueryURL(qWxCity);
  console.log(qWxQueryURL);
  // qUVQueryURL needs lat/long from getCurrentWeather() for valid request
  qUVQueryURL = setUVQueryURL(qOWAPI);
  // returned by getCurrentWeather()
  qWxFiveDayForecastURL = setWxFiveDayForecastURL(qWxCity);
  console.log(qWxFiveDayForecastURL);

  updateCitiesSearched();
  // todo: implement write to localStorage

  main(qWxCity);
});

function setWxQueryURL(qWxCity) {
  // qWxQueryURL = 'https://api.openweathermap.org/data/2.5/weather?' + qWxCity + qWxUnits + qOWAPI;
  return qWxQueryURL = 'https://api.openweathermap.org/data/2.5/weather?' + qWxCity + qWxUnits + qOWAPI;
}

function setWxFiveDayForecastURL(qWxCity) {
  // qWxFiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?' + qWxCity + qWxUnits + qOWAPI;
  return qWxFiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?' + qWxCity + qWxUnits + qOWAPI;
}

function setUVQueryURL(qOWAPI) {
    // qUVQueryURL = 'https://api.openweathermap.org/data/2.5/uvi?' + qOWAPI;
  return qUVQueryURL = 'https://api.openweathermap.org/data/2.5/uvi?' + qOWAPI;
}

// todo: reset currentWx and 5dForecast URLs
$('#citiesSearched').on('click', 'a', function(event) {
  // event.preventDefault;
  console.log('in city click event');
  // console.log('this: ' + $(this));
  // console.log('this.val().trim(): ' + $(this).val().trim());
  console.log('this.text().trim(): ' + $(this).text().trim());
  qWxCity = '&q=' + $(this).text().trim();
  console.log('citiesSearched - qWxCity: ' + qWxCity);
  qWxQueryURL = setWxQueryURL(qWxCity);
  qWxFiveDayForecastURL = setWxFiveDayForecastURL(qWxCity);
  qUVQueryURL = setUVQueryURL(qOWAPI);
  main(qWxCity);
});

// todo: implement click to search >> reorder list
// todo: improvement: prevent dupes? / replace older instance with newer?
function updateCitiesSearched() {
  var newCity = `<a href="#" class="list-group-item list-group-item-action citySearch" style="text-transform:capitalize;">${wxCity}</a>`;
  $('#citiesSearched').prepend(newCity);
  // <a href="#" class="list-group-item list-group-item-action active">Austin</a>
  // <a href="#" class="list-group-item list-group-item-action">City</a>
}

// todo: need to clear before displaying new search results?
function getCurrentWeather(qWxCity) {
  console.log('qWxQueryURL: ' + qWxQueryURL);
  return $.ajax({
      url: qWxQueryURL,
      method: 'GET'      
  }).then(function(wxResponse) {
    console.log('in getCurrentWeather(): ' + qWxCity);
    // Log the queryURL
    // Log the resulting object
    // Populate HTML with wx response
    $('.city').text(wxResponse.name);
    // populate date in header: Day, Month Date
    var dateToday = moment().format('M/D/YYYY');
    $("#currentDay").text('(' + dateToday + ')');
    // Set weather icon and alt text
    //https://openweathermap.org/img/wn/10d@2x.png
    var wxIcon = 'https://openweathermap.org/img/wn/' + wxResponse.weather[0].icon + '.png'; // todo: more elegant method than assuming 0th index?
    var wxIconAlt = wxResponse.weather[0].main;
    // $('.icon').attr('src', wxIcon);
    // $('.icon').attr('alt', wxIconAlt);
    $('#wxIcon').html('<img src="' + wxIcon + '" alt="' + wxIconAlt + '" />');
    // $('#theDiv').prepend('<img id="theImg" src="theImg.png" />')
    $('.temp').html('Temperature: ' + wxResponse.main.temp + ' &#8457;');
    $('.humidity').text('Humidity: ' + wxResponse.main.humidity + ' %');
    $('.wind').text('Wind Speed: ' + wxResponse.wind.speed + ' MPH');
    // set for getUV()
    qUVLon = '&lon=' + wxResponse.coord.lon;
    qUVLat = '&lat=' + wxResponse.coord.lat;
    // todo: implement setUVURL() method
    qUVQueryURL += ('' + qUVLat + qUVLon);
    console.log('qUVLat: ' + qUVLat + ', qUVLon: ' + qUVLon);
    console.log('qUVQueryURL: ' + qUVQueryURL);
  });
}

function getUV() {
  return $.ajax({
      url: qUVQueryURL,
      method: 'GET'
  }).then(function(uvResponse) {
    console.log('qUVQueryURL: ' + qUVQueryURL);
    var uvIndex = uvResponse.value;
    console.log('uvResponse.value: ' + uvResponse.value);
    var strUVIndex = getUVIndexColor(uvIndex);
    $('.uv').html('UV Index: ' + '<button class="btn" style="background-color: ' + strUVIndex + '; font-size: 1.1em; font-weight: bold">' + uvIndex + '</button>');
  });
}

function getUVIndexColor(int) {
  // https://en.wikipedia.org/wiki/Ultraviolet_index
  var strUVIndex = int;
  switch (true) {
    case (strUVIndex >= 0 && strUVIndex <= 2.99) :
      return '#5DA541'; // return green, low
    case (strUVIndex >= 3.0 && strUVIndex <= 5.99) :
      return '#FDF451'; // return yellow, moderate
    case (strUVIndex >= 6.0 && strUVIndex <= 7.99) :
      return '#E39034'; // return orange, high
    case (strUVIndex >= 8.0 && strUVIndex <= 10.99) :
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
  // which are the 3PMs? 7th, then 8 apart; i = 5, 13, 21, 29, 37 (ugh! hate magic numbers!)
  // todo: implememnt functionality allowing return of 3PM forecast regardless of location/timezone

  return $.ajax({
    url: qWxFiveDayForecastURL,
    method: 'GET'
  }).then(function(fiveDayResponse) {
    // todo: if not necessary to empty, reset to: var subFiveDayResp = fiveDayResponse.list;
    var subFiveDayResp = [];
    subFiveDayResp = fiveDayResponse.list;
      subFiveDayResp.splice(38);
      subFiveDayResp.splice(30,7);
      subFiveDayResp.splice(22,7);
      subFiveDayResp.splice(14,7);
      subFiveDayResp.splice(6,7);
      subFiveDayResp.splice(0,5);
      console.log(subFiveDayResp);
    $("#wxCards").html("");
    var wxCard = "";
    for (i = 0; i < subFiveDayResp.length; i++ ) {
      var wxCardTime = moment(moment.unix(subFiveDayResp[i].dt).utc().toDate()).format('M/D/YYYY'); //format('M/D/YYYY')
      // var wxCardTime = 'M/D/YYYY';
      var wxCardIcon = subFiveDayResp[i].weather[0].icon; // todo: more elegant method than assuming 0th index?
      var wcCardIconAlt = subFiveDayResp[i].weather[0].main;
      // todo: find fix for date wrapping and/or getting cut off >> card with min width??
      wxCard += `<div class="card bg-primary text-white">
        <div class="card-body">
          <h5 class="card-title text-nowrap">${wxCardTime}</h5>
          <p class="card-text">
            <img src="https://openweathermap.org/img/wn/${wxCardIcon}.png" alt="${wcCardIconAlt}" /><br/>
            Temp: <span class="text-nowrap">${subFiveDayResp[i].main.temp} &#8457;</span><br/>
            Humidity: <span class="text-nowrap">${subFiveDayResp[i].main.humidity} %</span><br/>
          </p>
        </div>
      </div>`;

    }
    $("#wxCards").append(wxCard);
  });
  
}
 
function main(qWxCity) {
  console.log('main - qWxCity: ' + qWxCity);
  getCurrentWeather(qWxCity).then(getUV).then(getFiveDayForecast);
}

});