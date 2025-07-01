//** CONFIG IMPORT */
import { WEATHER_API_KEY } from "../utils/constants";

//** CLASS IMPORT */
import TokenService from "../security.services/token.service";
import type { WeatherData, ForecastData } from "./weather.interface";


class WeatherService {
    /**
     * Retrieves the current weather data for a specified city using the WeatherAPI service.
     *
     * @param city - The name of the city for which to fetch the current weather.
     * @returns A promise that resolves to a {@link WeatherData} object containing the current weather information.
     * @throws Will throw an error if the fetch operation fails or if the response is not OK.
     */
    public async currentWeather(token: string, city: string): Promise<WeatherData> {
        const tokenService = new TokenService();
        await tokenService.verifyAccessToken(token);

        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            const data: WeatherData = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw error;
        }
    }

        /**
         * Retrieves the current weather data for a specified city using the WeatherAPI service.
         *
         * @param city - The name of the city for which to fetch the current weather.
         * @returns A promise that resolves to a {@link WeatherData} object containing the current weather information.
         * @throws Will throw an error if the fetch operation fails or if the response is not OK.
         */
        public async currentWeatherInternal(lat: number, lng: number): Promise<WeatherData> {
        const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lng}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            const data: WeatherData = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw error;
        }
    }

    /**
     * Retrieves 7-day weather forecast for a specified location.
     *
     * @param token - JWT access token for authentication
     * @param location - The location (city name, lat/long, etc.) to get forecast for
     * @returns A promise that resolves to a {@link ForecastData} object containing the forecast
     * @throws Will throw an error if authentication fails or if the API request fails
     */
    public async getForecast(token: string, location: string): Promise<ForecastData> {
        const tokenService = new TokenService();
        await tokenService.verifyAccessToken(token);

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=7&aqi=no&alerts=no`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching forecast data: ${response.statusText}`);
            }
            const data: ForecastData = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching forecast data:", error);
            throw error;
        }
    }

}

export default WeatherService;