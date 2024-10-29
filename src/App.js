
import React, { useState } from 'react';
import './App.css';

const API_KEY = '20f9b0dfa5574105a62165830242905';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // Function to standardize location input
  const standardizeLocation = (input) => {
    const locationMap = {
      joburg: 'Johannesburg',
      nyc: 'New York',
      // Add more mappings as needed
    };
    return locationMap[input.toLowerCase()] || input;
  };

  // Function to fetch weather data from the API
  const fetchWeather = async () => {
    try {
      const standardizedCity = standardizeLocation(city);
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${standardizedCity}`);
      const data = await response.json();
      
      // Check if data contains the expected structure
      if (data && data.location && data.current) {
        setWeather(data);
        setError('');
      } else {
        // Handle case where API response is missing expected data
        setWeather(null);
        setError('No matching location found.');
        console.error('Unexpected API response:', data);
      }
    } catch (error) {
      // Handle errors in fetching data
      setWeather(null);
      setError('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to handle input change in the city input field
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="weather-app">
      <h1 className="app-title">Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input className="city-input" type="text" value={city} onChange={handleInputChange} placeholder="Enter city" />
        <button className="get-weather-button" type="submit">Get Weather</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {weather ? (
        <div className="weather-details">
          <h2 className="location">{weather.location.name}</h2>
          <p className="temperature">Temperature: {weather.current.temp_c}°C</p>
          <p className="condition">Condition: {weather.current.condition.text}</p>
          <img className="weather-icon" src={weather.current.condition.icon} alt={weather.current.condition.text} />
        </div>
      ) : (
        !error && <p className="no-weather">No weather data available. Please try a different city.</p>
      )}
    </div>
  );
};

export default WeatherApp;
