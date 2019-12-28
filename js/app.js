const apiKey = "YOUR_API_KEY";

(function () {
    function decimalAdjust(type, value, exp) {
        // Nếu exp có giá trị undefined hoặc bằng không thì...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }

        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }


    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }

    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();

const kToC = (templ) => {
    return Math.round10(templ - 273, -1);
}

const mphToKmph = (speed) => {
    return Math.round10(1.609344 * speed, -1);
}

// const img = {
//     i01d: "./icon/01d.png",
//     i02d: "./icon/02d.png",
//     i03d: "./icon/03d.png",
//     i04d: "./icon/04d.png",
//     i09d: "./icon/09d.png",
//     i10d: "./icon/10d.png",
//     i11d: "./icon/11d.png",
//     i13d: "./icon/13d.png",
//     i50d: "./icon/50d.png",
//     i01n: "./icon/01n.png",
//     i02n: "./icon/02n.png",
//     i03n: "./icon/03n.png",
//     i04n: "./icon/04n.png",
//     i09n: "./icon/09n.png",
//     i10n: "./icon/10n.png",
//     i11n: "./icon/11n.png",
//     i13n: "./icon/13n.png",
//     i50n: "./icon/50n.png"
// }

const description = [
    "Quang mây", "Ít mây", "Mây rải rác",
    "Âm u", "Mưa rào", "Mưa",
    "Sấm chớp", "Tuyết rơi", "Sương mù"
];

const dataDescription = [
    "clear sky", "few clouds",
    "scattered clouds", "broken clouds", "shower rain",
    "rain", "thunderstorm", "snow", "mist"
];

$(document).ready(() => {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?id=1581130&appid=${apiKey}`,
        type: "get",
        dataType: "json",
        success: (data) => {
            let imageData = data.weather[0].icon;
            $("#image").append('<img src="./icons/'+ imageData +'.png" />');
            $("#templ-cur").replaceWith(kToC(data.main.temp));
            $("#feeling-templ").replaceWith(kToC(data.main.feels_like));
            $("#wind-speed").replaceWith(data.wind.speed);
            $("#humidity").replaceWith(data.main.humidity);
            $("#descr").replaceWith(description[dataDescription.indexOf(data.weather[0].description)]);
            console.log(data.weather[0].description);

            let windDeg = data.wind.deg;
            if (windDeg) {
                let windDirection;
                if (windDeg < 22.5 || windDeg >= 337.5) windDirection = "Bắc";
                if (windDeg < 67.5 && windDeg >= 22.5) windDirection = "Đông Bắc";
                if (windDeg < 112.5 && windDeg >= 67.5) windDirection = "Đông";
                if (windDeg < 157.5 && windDeg >= 112.5) windDirection = "Đông Nam";
                if (windDeg < 202.5 && windDeg >= 157.5) windDirection = "Nam";
                if (windDeg < 247.5 && windDeg >= 202.5) windDirection = "Tây Nam";
                if (windDeg < 292.5 && windDeg >= 247.5) windDirection = "Tây";
                if (windDeg < 337.5 && windDeg >= 292.5) windDirection = "Tây Bắc";
                
                $("#wind-direct").replaceWith(windDirection);
            }
            else {
                $("#wind-direct").replaceWith("Không rõ");
            }
        }
    });
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?id=1581130&appid=${apiKey}`,
        type: "get",
        dataType: "json",
        success: (data) => {
            $("#min-templ").replaceWith(kToC(data.list[0].main.temp_min));
            $("#max-templ").replaceWith(kToC(data.list[0].main.temp_max));
        }
    });
});
