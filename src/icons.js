

function chooseIcon(conditions) {
  console.log(conditions)
  let isDay = conditions.is_day ? 'day' : 'night';
  let weather_type = `clearsky_${isDay}`;

  if (conditions.cloud_cover > 50) weather_type = 'cloudy';
  else if (conditions.cloud_cover > 20) weather_type = `fair_${isDay}`;

  if (conditions.rain > 10) weather_type = "heavyrain";
  else if (conditions.rain > 2.5) weather_type = "rain";
  else if (conditions.rain <= 2.5 && conditions.rain > 0) weather_type = "lightrain";

  if (conditions.snowfall >= 2.1) weather_type = "heavysnow";
  else if (conditions.snowfall > 0.1) weather_type = "snow";
  else if (conditions.snowfall <= 0.1 && conditions.snowfall > 0) weather_type = "lightsnow";

  return weather_type + '.svg';
}

function chooseIconHourly(conditions, hour) {
  const index = (typeof hour == 'date') ? hour.getHours() : hour;
  console.log(conditions)
  let isDay = (index > 7 && index < 17) ? 'day' : 'night';
  let weather_type = `clearsky_${isDay}`;

  if (conditions.cloud_cover[index] > 50) weather_type = 'cloudy';
  else if (conditions.cloud_cover[index] > 20) weather_type = `fair_${isDay}`;

  if (conditions.rain[index] > 10) weather_type = "heavyrain";
  else if (conditions.rain[index] > 2.5) weather_type = "rain";
  else if (conditions.rain[index] <= 2.5 && conditions.rain[index] > 0) weather_type = "lightrain";

  if (conditions.snowfall[index] >= 2.1) weather_type = "heavysnow";
  else if (conditions.snowfall[index] > 0.1) weather_type = "snow";
  else if (conditions.snowfall[index] <= 0.1 && conditions.snowfall[index] > 0) weather_type = "lightsnow";

  return weather_type + '.svg';
}

export {chooseIcon, chooseIconHourly};