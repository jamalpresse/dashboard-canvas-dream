import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind } from "lucide-react";
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}
interface WeatherWidgetProps {
  city?: string;
  className?: string;
}
export function WeatherWidget({
  city = "Casablanca",
  className
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // OpenWeatherMap API gratuitement disponible - clé API limitée mais fonctionnelle pour ce projet
        const apiKey = "1635890035cbba097fd5c26c8ea672a1";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
          throw new Error(`Erreur de l'API météo: ${response.statusText}`);
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données météo:", err);
        setError("Impossible de charger la météo");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  // Fonction pour déterminer l'icône en fonction des conditions météo
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-10 w-10 text-yellow-400" />;
    const weatherId = weather.weather[0].id;

    // Correspond aux codes météo d'OpenWeatherMap
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="h-10 w-10 text-gray-600" />;
    } else if (weatherId >= 300 && weatherId < 600) {
      return <CloudRain className="h-10 w-10 text-blue-400" />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="h-10 w-10 text-blue-100" />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return <Wind className="h-10 w-10 text-gray-400" />;
    } else if (weatherId === 800) {
      return <Sun className="h-10 w-10 text-yellow-400" />;
    } else {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    }
  };
  return;
}