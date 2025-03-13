import React, { useState, useEffect } from "react";
import axios from "axios";
import heavyRainImage from './assets/icons8-umbrella-100.png';
import moderateRain from './assets/icons8-rain-cloud-100.png';
import lightRain from './assets/icons8-raincoat-100.png';
import sunny from './assets/icons8-sunny-100.png';

const BASE_URL = "https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/";

const districts = [
  { id: 1010500, name: "Aveiro" },
  { id: 1020500, name: "Beja" },
  { id: 1030300, name: "Braga" },
  { id: 1040200, name: "Bragança" },
  { id: 1050200, name: "Castelo Branco" },
  { id: 1060300, name: "Coimbra" },
  { id: 1070500, name: "Évora" },
  { id: 1080500, name: "Faro" },
  { id: 1090700, name: "Guarda" },
  { id: 1100900, name: "Leiria" },
  { id: 1110600, name: "Lisboa" },
  { id: 1121400, name: "Portalegre" },
  { id: 1131200, name: "Porto" },
  { id: 1141600, name: "Santarém" },
  { id: 1151200, name: "Setúbal" },
  { id: 1160900, name: "Viana do Castelo" },
  { id: 1171400, name: "Vila Real" },
  { id: 1182300, name: "Viseu" },
  { id: 2310300, name: "Funchal (Madeira)" },
  { id: 2320100, name: "Porto Santo (Madeira)" },
  { id: 3410100, name: "Vila do Porto (Açores)" },
  { id: 3420300, name: "Ponta Delgada (Açores)" },
  { id: 3430100, name: "Angra do Heroísmo (Açores)" },
  { id: 3440100, name: "Santa Cruz da Graciosa (Açores)" },
  { id: 3450200, name: "Velas (Açores)" },
  { id: 3460200, name: "Madalena (Açores)" },
  { id: 3470100, name: "Horta (Açores)" },
  { id: 3480200, name: "Santa Cruz das Flores (Açores)" },
  { id: 3490100, name: "Vila do Corvo (Açores)" },
];

function App() {
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [todayWeather, setTodayWeather] = useState(null);
  const [umbrellaMessage, setUmbrellaMessage] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (selectedDistrictId) {
      getWeather(selectedDistrictId);
    }
  }, [selectedDistrictId]);

  const getWeather = async (districtId) => {
    if (!districtId) return;

    try {
      const response = await axios.get(`${BASE_URL}${districtId}.json`);
      const today = new Date().toISOString().split("T")[0]; // Data de hoje no formato YYYY-MM-DD

      const todayData = response.data.data.find((day) => day.forecastDate === today);

      if (todayData) {
        setTodayWeather(todayData);

        // Definir mensagem com base na probabilidade de chuva
        const rainProbability = parseFloat(todayData.precipitaProb);

        let message = "";
        let image = "";

        if (rainProbability < 20) {
          message = "Sem chuva prevista. Guarda-chuva não é necessário.";
          image = sunny;
        } else if (rainProbability < 50) {
          message = "Pode chover um pouco. Um casaco com capuz pode ser suficiente.";
          image = lightRain;
        } else if (rainProbability < 80) {
          message = "Chuva moderada prevista. Leve um guarda-chuva por precaução.";
          image = moderateRain;
        } else {
          message = "Chuva intensa prevista. É altamente recomendável levar guarda-chuva.";
          image = heavyRainImage;
        }

        setUmbrellaMessage(message);
        setImageSrc(image);
      } else {
        setTodayWeather(null);
        setUmbrellaMessage("Sem previsão disponível para hoje.");
        setImageSrc("");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do IPMA:", error);
      setUmbrellaMessage("Erro ao obter a previsão do tempo.");
      setImageSrc("");
    }
  };

  return (
    <div className="bg-blue-200 min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight text-blue-400 sm:text-5xl md:text-6xl mt-8 mb-8">
  Levo o{" "}
  <span
    className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
    guarda-chuva
  </span>
  {" hoje?"}
</h1>


<div className="animate-slide-up bg-white w-96 p-4 rounded-md border-2 border-lightgrey shadow-lg shadow-blue-500/50">
  {/* Seleção de distrito */}
  <div className="mb-6">
    <select
      className="animate-slide-up bg-white w-full mt-6 p-2 rounded-md shadow-md shadow-blue-500/50"
      onChange={(e) => setSelectedDistrictId(e.target.value)}
      defaultValue=""
    >
      <option value="" disabled>
        Escolha o distrito
      </option>
      {districts.map((district) => (
        <option key={district.id} value={district.id}>
          {district.name}
        </option>
      ))}
    </select>
  </div>

  {/* Previsão do tempo */}
  {todayWeather && (
    <div className="animate-slide-up bg-white w-90 mt-6 p-4 rounded-md shadow-lg shadow-blue-500/50">
      <h2 className="text-lg font-bold text-center mb-4">Previsão do Tempo - Hoje</h2>
      <p>🌡️ Mín: {todayWeather.tMin}°C | Máx: {todayWeather.tMax}°C</p>
      <p>🌧️ Prob. de Chuva: {todayWeather.precipitaProb}%</p>
      <p>💨 Vento: {todayWeather.predWindDir}</p>

      {imageSrc && (
        <div className="mt-4 text-center">
          <img src={imageSrc} alt="Imagem do clima" className="w-32 h-32 mx-auto shadow-md shadow-gray-400/50 rounded-lg" />
        </div>
      )}

      <p className="mt-4 text-center font-semibold text-blue-600">{umbrellaMessage}</p>
    </div>
  )}
</div>
    </div>
  );
}

export default App;
