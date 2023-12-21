import logo from './logo.svg';
import loadingImg from './loading.svg';
import './App.css';
import { useEffect, useState } from 'react';
import useForecast from './components/useForecast';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';
import {chooseIcon, chooseIconHourly} from './icons';
import windArrow from './windarrow.svg';

function App() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [forecast, loading] = useForecast(query);

  async function handleSubmit(e) {
    e.preventDefault();
    setQuery(search);
  }

  function ForecastLoaded() {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Weather in ' + forecast.name,
        }
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: false
        }
      },
      tension: 0.5,
      backgroundColor: (context) => {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        return value < 0 ? 'blue' : 'red';
      },
      pointStyle: false
    }
    const data = {
      labels: forecast.hourly.time.map((time, index) => {
        let y;
        if (index >= 1) y = new Date(forecast.hourly.time[index-1]);
        const c = new Date(time);
        if (index == 0 || y && c.getDay() !== y.getDay()) {
          return c.toLocaleString('nb-NO', {weekday: "long", hour: "numeric", minute: "numeric"});
        }
        return c.toLocaleTimeString('nb-NO', {hour: "numeric", minute: "numeric"});
      }),
      datasets: [
        {
          label: 'Temperature',
          segment: {
            borderColor: (ctx) => {
              const value = ctx.p1.parsed.y;
              return value < 0 ? 'blue' : 'red';
            }
          },
          data: forecast.hourly.temperature_2m
        }
      ]
    }

    function GenerateShortForecast() {
      let jsx = [];
      let i = new Date(forecast.current.time).getHours() + 1;
      let lim = i + 10;
      while (i < lim) {
        jsx.push(
          <li className='forecast-details'>
            <div className='d-flex flex-row'>
              <span className='forecast-time'>{new Date(forecast.hourly.time[i]).toLocaleTimeString('nb-NO', {hour: 'numeric', minute: 'numeric'})}</span>
              <img src={`/weathericons/weather/svg/${chooseIconHourly(forecast.hourly, i)}`} height={36} />
            </div>
            <span style={{color: forecast.hourly.temperature_2m[i] >= 0 ? 'red' : 'blue'}}>{forecast.hourly.temperature_2m[i]}{forecast.current_units.temperature_2m}</span>
            <div className='d-flex flex-row'>
              <div style={{transform: `rotate(${forecast.hourly.wind_direction_10m[i]}deg)`}}>
                <img src={windArrow} height={24} />
              </div>
              <span>{forecast.hourly.wind_speed_10m[i]}{forecast.current_units.wind_speed_10m}</span>
            </div>
            <div>
              {forecast.hourly.rain[i] > 0 ? <span>{forecast.hourly.rain[i]}mm</span> : null}
            </div>
            <div>
              {forecast.hourly.snowfall[i] > 0 ? <span>{forecast.hourly.snowfall[i]}cm</span> : null}
            </div>
          </li>
        );
        i++;
      }
      return jsx;
    }

    return (
      <>
        <h1>{forecast.name}</h1>
        <div className='d-flex'>
          <div className='d-flex flex-column col-3'>
            <img src={`/weathericons/weather/svg/${chooseIcon(forecast.current)}`} width={156} />
            <span style={{ fontSize: 36, color: forecast.current.temperature_2m >= 0 ? 'red' : 'blue'}}>{forecast.current.temperature_2m}{forecast.current_units.temperature_2m}</span>
          </div>
          <div className='d-flex flex-column col-9 shorttime-forecast'>
            <ul>
              {GenerateShortForecast()}
            </ul>
          </div>
        </div>
        <div>
          <Line options={options} data={data}></Line>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='container'>
        <form className='d-flex ' onSubmit={handleSubmit}>
          <div className='flex-fill form-floating'>
            <input id='location' className='form-control' placeholder='Location' value={search} onInput={(e) => { setSearch(e.target.value) }} />
            <label htmlFor='location'>Enter location</label>
          </div>
          <input className='btn btn-primary' type='submit' />
        </form>
        <section id='weather'>
          {
            loading ? <img className='loading' src={loadingImg} width={63} /> : null
          }
          {
            !loading && forecast && forecast.current ? ForecastLoaded() :
              forecast.error ? <h2>{forecast.error}</h2> : null
          }
        </section>
      </div>
    </>
  );
}

export default App;
