import { useEffect, useState } from "react";

const useForecast = (searchLocation) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function query(search) {
      try {
        setLoading(true);
        const responseGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=10&language=en&format=json`);
        const jsonGeo = await responseGeo.json();
        if (!jsonGeo.results) throw "No results";
        const resForecast = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${jsonGeo.results[0].latitude}&longitude=${jsonGeo.results[0].longitude}&current=temperature_2m,is_day,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms&timezone=auto`);
        const jsonForecast = await resForecast.json();
        if (jsonForecast.error) throw jsonForecast.reason;
        const finalResult = {...jsonGeo.results[0], ...jsonForecast}
        setResult(finalResult);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setResult({error: error});
      }
    }

    if (searchLocation !== "") {
      query(searchLocation);
    }
  }, [searchLocation]);
 
  return [result, loading];
}

export default useForecast;