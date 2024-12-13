import React, { useState } from 'react';
import { 
  MapPin, 
  Loader2, 
  AlertTriangle, 
  Cloud, 
  Thermometer, 
  Wind, 
  Droplet,
  Sun
} from 'lucide-react';

const LocationFinder = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

  const findLocation = () => {
    setLocation(null);
    setWeather(null);
    setError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        Promise.all([
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        ])
        .then(async ([locationResponse, weatherResponse]) => {
          const locationData = await locationResponse.json();
          const weatherData = await weatherResponse.json();

          setLocation({
            latitude,
            longitude,
            address: locationData.display_name || 'Address not found'
          });

          setWeather({
            temperature: Math.round(weatherData.main.temp),
            feelsLike: Math.round(weatherData.main.feels_like),
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            description: weatherData.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
          });

          setLoading(false);
        })
        .catch((err) => {
          setError('Could not retrieve location or weather information');
          setLoading(false);
        });
      },
      (err) => {
        setError(err.message || 'Could not retrieve location');
        setLoading(false);
      }
    );
  };

  const getWeatherBackground = () => {
    if (!weather) return 'bg-gradient-to-br from-blue-100 to-blue-300';
    const temp = weather.temperature;
    if (temp < 10) return 'bg-gradient-to-br from-blue-200 to-blue-500';
    if (temp < 20) return 'bg-gradient-to-br from-blue-300 to-blue-600';
    if (temp < 30) return 'bg-gradient-to-br from-orange-200 to-orange-500';
    return 'bg-gradient-to-br from-red-300 to-red-600';
  };

  return (
    <div className={`
      max-w-md mx-auto p-6 rounded-2xl shadow-2xl 
      ${getWeatherBackground()}
      transition-all duration-500 ease-in-out
      transform hover:scale-105
    `}>
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center justify-center">
          <MapPin className="mr-3 text-blue-600" size={36} />
          LOCOFIND
        </h1>
        
        <button 
          onClick={findLocation}
          className={`
            w-full py-3 rounded-lg text-white font-bold uppercase tracking-wider
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
            transition-all duration-300 ease-in-out
            flex items-center justify-center
            transform hover:scale-102 active:scale-95
          `}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Locating...
            </>
          ) : (
            'Find My Location'
          )}
        </button>

        {error && (
          <div className="
            mt-4 p-4 
            bg-red-50 border-l-4 border-red-500 
            text-red-700 
            rounded-r-lg
            flex items-center
            animate-pulse
          ">
            <AlertTriangle className="mr-3 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {location && (
          <div className="
            mt-4 
            bg-blue-50 
            border-l-4 border-blue-500 
            p-4 
            rounded-r-lg
            transition-all duration-300
          ">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <MapPin className="mr-2 text-blue-600" />
              Location Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Latitude:</strong> {location.latitude.toFixed(4)}
              </p>
              <p>
                <strong>Longitude:</strong> {location.longitude.toFixed(4)}
              </p>
              {location.address && (
                <p className="italic">
                  <strong>Address:</strong> {location.address}
                </p>
              )}
            </div>
          </div>
        )}

        {weather && (
          <div className="
            mt-4 
            bg-white 
            border border-gray-200 
            rounded-2xl 
            p-5 
            shadow-md
            transition-all duration-500
          ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img 
                  src={weather.icon} 
                  alt="Weather Icon" 
                  className="w-20 h-20 mr-4"
                />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {weather.temperature}°C
                  </p>
                  <p className="text-gray-600 capitalize">
                    {weather.description}
                  </p>
                </div>
              </div>
              <Cloud className="text-blue-500" size={48} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="
                bg-blue-50 
                p-3 
                rounded-lg 
                flex flex-col 
                items-center 
                justify-center
              ">
                <Thermometer className="text-blue-500 mb-1" />
                <span className="font-medium text-gray-700">
                  {weather.feelsLike}°C
                </span>
                <p className="text-xs text-gray-500">Feels Like</p>
              </div>
              <div className="
                bg-blue-50 
                p-3 
                rounded-lg 
                flex flex-col 
                items-center 
                justify-center
              ">
                <Droplet className="text-blue-500 mb-1" />
                <span className="font-medium text-gray-700">
                  {weather.humidity}%
                </span>
                <p className="text-xs text-gray-500">Humidity</p>
              </div>
              <div className="
                bg-blue-50 
                p-3 
                rounded-lg 
                flex flex-col 
                items-center 
                justify-center
              ">
                <Wind className="text-blue-500 mb-1" />
                <span className="font-medium text-gray-700">
                  {weather.windSpeed} m/s
                </span>
                <p className="text-xs text-gray-500">Wind Speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFinder;