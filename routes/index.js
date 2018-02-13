// Global constants and required node packages
const express = require('express');
const router = express.Router();
const request = require('request');

// Global arrays and variables
let weather = []; // Array for weather (type) responses (W)
let feels = []; // Array for feels-like temperature responses (F)
let temps = []; // Array for actual temperature responses (T)
let rain = []; // Array for precipitation probability responses (Pp)
let wind_dir = []; // Array for wind direction responses (D)
let wind_spd = []; // Array for wind speed responses (S)
let wind_gust = []; // Array for wind gust speed responses (G)
let vis = []; // Array for visibility responses (V)
let day0 = ""; // Variable for day of the week the response was called on. Variables 1, 2, 3 & 4 populate as the following four days
let day1 = "";
let day2 = "";
let day3 = "";
let day4 = "";

// Array of days of the week, four additional entries for ease of populating day1/2/3/4 variables 
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

// API call for 5-day, 3-hourly forecast from MET Office Datapoint re: Plymouth, UK. Includes API key (not surfaced on client)
const url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/310016?res=3hourly&key=2e4007b4-2c8a-4527-992e-7b5ad55090f1";

// HTTP GET request
function dataRequest(){
    request(url, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
        const pd = body.SiteRep.DV.Location.Period;
        const rp = body.SiteRep.DV.Location.Period[0].Rep;
        if (rp.length < 8){     // Datapoint calls don't always return older reports on the current day (eg. the 3am forecast on a call at 3pm), this populates the empty responses with "n/a"
            for (let i = 0; i < 8 - rp.length; i++){
                weather.push("n/a");
                feels.push("n/a");
                temps.push("n/a");
                rain.push("n/a");
                wind_dir.push("n/a");
                wind_spd.push("n/a");
                wind_gust.push("n/a");
                vis.push("n/a");
            }
        }
        // Nested for loop to cycle through each 3-hourly report (up to 8) over a five-day period, returning a response for each reading per period per day. 
        for (let i = 0; i < pd.length; i++){ 
            const deg = '\u2103';
            const rp0 = body.SiteRep.DV.Location.Period[i].Rep; // Same as above constant, unsure about scope so new const made, may be able to bin
            for (let j = 0; j < rp0.length; j++){
                weather.push(body.SiteRep.DV.Location.Period[i].Rep[j].W);
                feels.push(body.SiteRep.DV.Location.Period[i].Rep[j].F + " " + deg);
                temps.push(body.SiteRep.DV.Location.Period[i].Rep[j].T + " " + deg);
                rain.push(body.SiteRep.DV.Location.Period[i].Rep[j].Pp + "%");
                wind_dir.push(body.SiteRep.DV.Location.Period[i].Rep[j].D);
                wind_spd.push(body.SiteRep.DV.Location.Period[i].Rep[j].S + " m/s");
                wind_gust.push(body.SiteRep.DV.Location.Period[i].Rep[j].G + " m/s");
                vis.push(body.SiteRep.DV.Location.Period[i].Rep[j].V);
            }
        }
    });
//    console.log("API request sent.");
}

// Alters returned data to readable format
function dataCheck(){
    for (let i = 0; i < weather.length; i++){
        if (weather[i] == "NA") weather[i] = "Not Available";
        if (weather[i] == 0) weather[i] = "Clear Night";
        if (weather[i] == 1) weather[i] = "Sunny Day";
        if (weather[i] == 2) weather[i] = "Partly Cloudy (Night)";
        if (weather[i] == 3) weather[i] = "Partly Cloudy (Day)";
        if (weather[i] == 5) weather[i] = "Mist"; // Code 4 isn't used by the API
        if (weather[i] == 6) weather[i] = "Fog";
        if (weather[i] == 7) weather[i] = "Cloudy";
        if (weather[i] == 8) weather[i] = "Overcast";
        if (weather[i] == 9) weather[i] = "Light Showers (Night)";
        if (weather[i] == 10) weather[i] = "Light Showers (Day)";
        if (weather[i] == 11) weather[i] = "Drizzle";
        if (weather[i] == 12) weather[i] = "Light Rain";
        if (weather[i] == 13) weather[i] = "Heavy Showers (Night)";
        if (weather[i] == 14) weather[i] = "Heavy Showers (Day)";
        if (weather[i] == 15) weather[i] = "Heavy Rain";
        if (weather[i] == 16) weather[i] = "Sleet Shower (Night)";
        if (weather[i] == 17) weather[i] = "Sleet Shower (Day)";
        if (weather[i] == 18) weather[i] = "Sleet";
        if (weather[i] == 19) weather[i] = "Hail Showers (Night)";
        if (weather[i] == 20) weather[i] = "Hail Showers (Day)";
        if (weather[i] == 21) weather[i] = "Hail";
        if (weather[i] == 22) weather[i] = "Light Snow Showers (Night)";
        if (weather[i] == 23) weather[i] = "Light Snow Showers (Day)";
        if (weather[i] == 24) weather[i] = "Light Snow";
        if (weather[i] == 25) weather[i] = "Heavy Snow Showers (Night)";
        if (weather[i] == 26) weather[i] = "Heavy Snow Showers (Day)";
        if (weather[i] == 27) weather[i] = "Heavy Snow";
        if (weather[i] == 28) weather[i] = "Thunder Shower (Night)";
        if (weather[i] == 29) weather[i] = "Thunder Shower (Day)";
        if (weather[i] == 30) weather[i] = "Thunder";
        
        if (vis[i] == "UN") vis[i] = "Unknown";
        if (vis[i] == "VP") vis[i] = "Very Poor";
        if (vis[i] == "PO") vis[i] = "Poor";
        if (vis[i] == "MO") vis[i] = "Moderate";
        if (vis[i] == "GO") vis[i] = "Good";
        if (vis[i] == "VG") vis[i] = "Very Good";
        if (vis[i] == "EX") vis[i] = "Excellent";
    }
//    console.log("Data formatted");
}

// Calculates day of API call and assigns correct day labels to the five day variables using day label array
function getDays(){
    let d = new Date();
    for (let i = 0; i < 6; i++){
        if (d.getDay() == i){
            day0 = days[i];
            day1 = days[i+1];
            day2 = days[i+2];
            day3 = days[i+3];
            day4 = days[i+4];
        }
    }
//    console.log("Days calculated");
}

/* GET home page. */
router.get('/', function(req, res, next) {
    // Call API data functions
    dataRequest();
    dataCheck();
    getDays();
    
    // Keywords for template, for dynamic placement on rendered page
    res.render('index', { 
                        title: "Kev's Weather App", 
                        
                        day0_time0_weather: weather[0],
                        day0_time3_weather: weather[1],
                        day0_time6_weather: weather[2],
                        day0_time9_weather: weather[3],
                        day0_time12_weather: weather[4],
                        day0_time15_weather: weather[5],
                        day0_time18_weather: weather[6],
                        day0_time21_weather: weather[7],
                        day1_time0_weather: weather[8],
                        day1_time3_weather: weather[9],
                        day1_time6_weather: weather[10],
                        day1_time9_weather: weather[11],
                        day1_time12_weather: weather[12],
                        day1_time15_weather: weather[13],
                        day1_time18_weather: weather[14],
                        day1_time21_weather: weather[15],
                        day2_time0_weather: weather[16],
                        day2_time3_weather: weather[17],
                        day2_time6_weather: weather[18],
                        day2_time9_weather: weather[19],
                        day2_time12_weather: weather[20],
                        day2_time15_weather: weather[21],
                        day2_time18_weather: weather[22],
                        day2_time21_weather: weather[23],
                        day3_time0_weather: weather[24],
                        day3_time3_weather: weather[25],
                        day3_time6_weather: weather[26],
                        day3_time9_weather: weather[27],
                        day3_time12_weather: weather[28],
                        day3_time15_weather: weather[29],
                        day3_time18_weather: weather[30],
                        day3_time21_weather: weather[31],
                        day4_time0_weather: weather[32],
                        day4_time3_weather: weather[33],
                        day4_time6_weather: weather[34],
                        day4_time9_weather: weather[35],
                        day4_time12_weather: weather[36],
                        day4_time15_weather: weather[37],
                        day4_time18_weather: weather[38],
                        day4_time21_weather: weather[39],
      
                        day0_time0_feels: feels[0],
                        day0_time3_feels: feels[1],
                        day0_time6_feels: feels[2],
                        day0_time9_feels: feels[3],
                        day0_time12_feels: feels[4],
                        day0_time15_feels: feels[5],
                        day0_time18_feels: feels[6],
                        day0_time21_feels: feels[7],
                        day1_time0_feels: feels[8],
                        day1_time3_feels: feels[9],
                        day1_time6_feels: feels[10],
                        day1_time9_feels: feels[11],
                        day1_time12_feels: feels[12],
                        day1_time15_feels: feels[13],
                        day1_time18_feels: feels[14],
                        day1_time21_feels: feels[15],
                        day2_time0_feels: feels[16],
                        day2_time3_feels: feels[17],
                        day2_time6_feels: feels[18],
                        day2_time9_feels: feels[19],
                        day2_time12_feels: feels[20],
                        day2_time15_feels: feels[21],
                        day2_time18_feels: feels[22],
                        day2_time21_feels: feels[23],
                        day3_time0_feels: feels[24],
                        day3_time3_feels: feels[25],
                        day3_time6_feels: feels[26],
                        day3_time9_feels: feels[27],
                        day3_time12_feels: feels[28],
                        day3_time15_feels: feels[29],
                        day3_time18_feels: feels[30],
                        day3_time21_feels: feels[31],
                        day4_time0_feels: feels[32],
                        day4_time3_feels: feels[33],
                        day4_time6_feels: feels[34],
                        day4_time9_feels: feels[35],
                        day4_time12_feels: feels[36],
                        day4_time15_feels: feels[37],
                        day4_time18_feels: feels[38],
                        day4_time21_feels: feels[39],
      
                        day0_time0_temp: temps[0],
                        day0_time3_temp: temps[1],
                        day0_time6_temp: temps[2],
                        day0_time9_temp: temps[3],
                        day0_time12_temp: temps[4],
                        day0_time15_temp: temps[5],
                        day0_time18_temp: temps[6],
                        day0_time21_temp: temps[7],
                        day1_time0_temp: temps[8],
                        day1_time3_temp: temps[9],
                        day1_time6_temp: temps[10],
                        day1_time9_temp: temps[11],
                        day1_time12_temp: temps[12],
                        day1_time15_temp: temps[13],
                        day1_time18_temp: temps[14],
                        day1_time21_temp: temps[15],
                        day2_time0_temp: temps[16],
                        day2_time3_temp: temps[17],
                        day2_time6_temp: temps[18],
                        day2_time9_temp: temps[19],
                        day2_time12_temp: temps[20],
                        day2_time15_temp: temps[21],
                        day2_time18_temp: temps[22],
                        day2_time21_temp: temps[23],
                        day3_time0_temp: temps[24],
                        day3_time3_temp: temps[25],
                        day3_time6_temp: temps[26],
                        day3_time9_temp: temps[27],
                        day3_time12_temp: temps[28],
                        day3_time15_temp: temps[29],
                        day3_time18_temp: temps[30],
                        day3_time21_temp: temps[31],
                        day4_time0_temp: temps[32],
                        day4_time3_temp: temps[33],
                        day4_time6_temp: temps[34],
                        day4_time9_temp: temps[35],
                        day4_time12_temp: temps[36],
                        day4_time15_temp: temps[37],
                        day4_time18_temp: temps[38],
                        day4_time21_temp: temps[39],
      
                        day0_time0_rain: rain[0],
                        day0_time3_rain: rain[1],
                        day0_time6_rain: rain[2],
                        day0_time9_rain: rain[3],
                        day0_time12_rain: rain[4],
                        day0_time15_rain: rain[5],
                        day0_time18_rain: rain[6],
                        day0_time21_rain: rain[7],
                        day1_time0_rain: rain[8],
                        day1_time3_rain: rain[9],
                        day1_time6_rain: rain[10],
                        day1_time9_rain: rain[11],
                        day1_time12_rain: rain[12],
                        day1_time15_rain: rain[13],
                        day1_time18_rain: rain[14],
                        day1_time21_rain: rain[15],
                        day2_time0_rain: rain[16],
                        day2_time3_rain: rain[17],
                        day2_time6_rain: rain[18],
                        day2_time9_rain: rain[19],
                        day2_time12_rain: rain[20],
                        day2_time15_rain: rain[21],
                        day2_time18_rain: rain[22],
                        day2_time21_rain: rain[23],
                        day3_time0_rain: rain[24],
                        day3_time3_rain: rain[25],
                        day3_time6_rain: rain[26],
                        day3_time9_rain: rain[27],
                        day3_time12_rain: rain[28],
                        day3_time15_rain: rain[29],
                        day3_time18_rain: rain[30],
                        day3_time21_rain: rain[31],
                        day4_time0_rain: rain[32],
                        day4_time3_rain: rain[33],
                        day4_time6_rain: rain[34],
                        day4_time9_rain: rain[35],
                        day4_time12_rain: rain[36],
                        day4_time15_rain: rain[37],
                        day4_time18_rain: rain[38],
                        day4_time21_rain: rain[39],
      
                        day0_time0_wind_dir: wind_dir[0],
                        day0_time3_wind_dir: wind_dir[1],
                        day0_time6_wind_dir: wind_dir[2],
                        day0_time9_wind_dir: wind_dir[3],
                        day0_time12_wind_dir: wind_dir[4],
                        day0_time15_wind_dir: wind_dir[5],
                        day0_time18_wind_dir: wind_dir[6],
                        day0_time21_wind_dir: wind_dir[7],
                        day1_time0_wind_dir: wind_dir[8],
                        day1_time3_wind_dir: wind_dir[9],
                        day1_time6_wind_dir: wind_dir[10],
                        day1_time9_wind_dir: wind_dir[11],
                        day1_time12_wind_dir: wind_dir[12],
                        day1_time15_wind_dir: wind_dir[13],
                        day1_time18_wind_dir: wind_dir[14],
                        day1_time21_wind_dir: wind_dir[15],
                        day2_time0_wind_dir: wind_dir[16],
                        day2_time3_wind_dir: wind_dir[17],
                        day2_time6_wind_dir: wind_dir[18],
                        day2_time9_wind_dir: wind_dir[19],
                        day2_time12_wind_dir: wind_dir[20],
                        day2_time15_wind_dir: wind_dir[21],
                        day2_time18_wind_dir: wind_dir[22],
                        day2_time21_wind_dir: wind_dir[23],
                        day3_time0_wind_dir: wind_dir[24],
                        day3_time3_wind_dir: wind_dir[25],
                        day3_time6_wind_dir: wind_dir[26],
                        day3_time9_wind_dir: wind_dir[27],
                        day3_time12_wind_dir: wind_dir[28],
                        day3_time15_wind_dir: wind_dir[29],
                        day3_time18_wind_dir: wind_dir[30],
                        day3_time21_wind_dir: wind_dir[31],
                        day4_time0_wind_dir: wind_dir[32],
                        day4_time3_wind_dir: wind_dir[33],
                        day4_time6_wind_dir: wind_dir[34],
                        day4_time9_wind_dir: wind_dir[35],
                        day4_time12_wind_dir: wind_dir[36],
                        day4_time15_wind_dir: wind_dir[37],
                        day4_time18_wind_dir: wind_dir[38],
                        day4_time21_wind_dir: wind_dir[39],
      
                        day0_time0_wind_spd: wind_spd[0],
                        day0_time3_wind_spd: wind_spd[1],
                        day0_time6_wind_spd: wind_spd[2],
                        day0_time9_wind_spd: wind_spd[3],
                        day0_time12_wind_spd: wind_spd[4],
                        day0_time15_wind_spd: wind_spd[5],
                        day0_time18_wind_spd: wind_spd[6],
                        day0_time21_wind_spd: wind_spd[7],
                        day1_time0_wind_spd: wind_spd[8],
                        day1_time3_wind_spd: wind_spd[9],
                        day1_time6_wind_spd: wind_spd[10],
                        day1_time9_wind_spd: wind_spd[11],
                        day1_time12_wind_spd: wind_spd[12],
                        day1_time15_wind_spd: wind_spd[13],
                        day1_time18_wind_spd: wind_spd[14],
                        day1_time21_wind_spd: wind_spd[15],
                        day2_time0_wind_spd: wind_spd[16],
                        day2_time3_wind_spd: wind_spd[17],
                        day2_time6_wind_spd: wind_spd[18],
                        day2_time9_wind_spd: wind_spd[19],
                        day2_time12_wind_spd: wind_spd[20],
                        day2_time15_wind_spd: wind_spd[21],
                        day2_time18_wind_spd: wind_spd[22],
                        day2_time21_wind_spd: wind_spd[23],
                        day3_time0_wind_spd: wind_spd[24],
                        day3_time3_wind_spd: wind_spd[25],
                        day3_time6_wind_spd: wind_spd[26],
                        day3_time9_wind_spd: wind_spd[27],
                        day3_time12_wind_spd: wind_spd[28],
                        day3_time15_wind_spd: wind_spd[29],
                        day3_time18_wind_spd: wind_spd[30],
                        day3_time21_wind_spd: wind_spd[31],
                        day4_time0_wind_spd: wind_spd[32],
                        day4_time3_wind_spd: wind_spd[33],
                        day4_time6_wind_spd: wind_spd[34],
                        day4_time9_wind_spd: wind_spd[35],
                        day4_time12_wind_spd: wind_spd[36],
                        day4_time15_wind_spd: wind_spd[37],
                        day4_time18_wind_spd: wind_spd[38],
                        day4_time21_wind_spd: wind_spd[39],
      
                        day0_time0_wind_gust: wind_gust[0],
                        day0_time3_wind_gust: wind_gust[1],
                        day0_time6_wind_gust: wind_gust[2],
                        day0_time9_wind_gust: wind_gust[3],
                        day0_time12_wind_gust: wind_gust[4],
                        day0_time15_wind_gust: wind_gust[5],
                        day0_time18_wind_gust: wind_gust[6],
                        day0_time21_wind_gust: wind_gust[7],
                        day1_time0_wind_gust: wind_gust[8],
                        day1_time3_wind_gust: wind_gust[9],
                        day1_time6_wind_gust: wind_gust[10],
                        day1_time9_wind_gust: wind_gust[11],
                        day1_time12_wind_gust: wind_gust[12],
                        day1_time15_wind_gust: wind_gust[13],
                        day1_time18_wind_gust: wind_gust[14],
                        day1_time21_wind_gust: wind_gust[15],
                        day2_time0_wind_gust: wind_gust[16],
                        day2_time3_wind_gust: wind_gust[17],
                        day2_time6_wind_gust: wind_gust[18],
                        day2_time9_wind_gust: wind_gust[19],
                        day2_time12_wind_gust: wind_gust[20],
                        day2_time15_wind_gust: wind_gust[21],
                        day2_time18_wind_gust: wind_gust[22],
                        day2_time21_wind_gust: wind_gust[23],
                        day3_time0_wind_gust: wind_gust[24],
                        day3_time3_wind_gust: wind_gust[25],
                        day3_time6_wind_gust: wind_gust[26],
                        day3_time9_wind_gust: wind_gust[27],
                        day3_time12_wind_gust: wind_gust[28],
                        day3_time15_wind_gust: wind_gust[29],
                        day3_time18_wind_gust: wind_gust[30],
                        day3_time21_wind_gust: wind_gust[31],
                        day4_time0_wind_gust: wind_gust[32],
                        day4_time3_wind_gust: wind_gust[33],
                        day4_time6_wind_gust: wind_gust[34],
                        day4_time9_wind_gust: wind_gust[35],
                        day4_time12_wind_gust: wind_gust[36],
                        day4_time15_wind_gust: wind_gust[37],
                        day4_time18_wind_gust: wind_gust[38],
                        day4_time21_wind_gust: wind_gust[39],
      
                        day0_time0_vis: vis[0],
                        day0_time3_vis: vis[1],
                        day0_time6_vis: vis[2],
                        day0_time9_vis: vis[3],
                        day0_time12_vis: vis[4],
                        day0_time15_vis: vis[5],
                        day0_time18_vis: vis[6],
                        day0_time21_vis: vis[7],
                        day1_time0_vis: vis[8],
                        day1_time3_vis: vis[9],
                        day1_time6_vis: vis[10],
                        day1_time9_vis: vis[11],
                        day1_time12_vis: vis[12],
                        day1_time15_vis: vis[13],
                        day1_time18_vis: vis[14],
                        day1_time21_vis: vis[15],
                        day2_time0_vis: vis[16],
                        day2_time3_vis: vis[17],
                        day2_time6_vis: vis[18],
                        day2_time9_vis: vis[19],
                        day2_time12_vis: vis[20],
                        day2_time15_vis: vis[21],
                        day2_time18_vis: vis[22],
                        day2_time21_vis: vis[23],
                        day3_time0_vis: vis[24],
                        day3_time3_vis: vis[25],
                        day3_time6_vis: vis[26],
                        day3_time9_vis: vis[27],
                        day3_time12_vis: vis[28],
                        day3_time15_vis: vis[29],
                        day3_time18_vis: vis[30],
                        day3_time21_vis: vis[31],
                        day4_time0_vis: vis[32],
                        day4_time3_vis: vis[33],
                        day4_time6_vis: vis[34],
                        day4_time9_vis: vis[35],
                        day4_time12_vis: vis[36],
                        day4_time15_vis: vis[37],
                        day4_time18_vis: vis[38],
                        day4_time21_vis: vis[39],
      
                        day0: day0,
                        day1: day1,
                        day2: day2,
                        day3: day3,
                        day4: day4,
                      });
});

module.exports = router;