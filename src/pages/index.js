import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
const finnhub = require("finnhub");

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [Stock1, setStock1] = useState("");
  const [Stock2, setStock2] = useState("");

  const [Stock1Data, setStock1Data] = useState();
  const [Stock2Data, setStock2Data] = useState();

  const [stocksDisplayed, setStocksDisplayed] = useState(false);
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "cp9n9v9r01qid795r3ogcp9n9v9r01qid795r3p0";
  const finnhubClient = new finnhub.DefaultApi();

  const handleAnalyze = () => {
    finnhubClient.financialsReported(
      { symbol: Stock1.toUpperCase() },
      (error, data, response) => {
        console.log(data.data[0].report);
        setStock1Data(data.data[0].report);
      }
    );

    finnhubClient.financialsReported(
      { symbol: Stock2.toUpperCase() },
      (error, data, response) => {
        setStock2Data(data.data[0].report);
      }
    );

    setStocksDisplayed(true);
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return (
    <main className="w-full flex-col gap-24 h-screen flex items-center justify-center place-content-center">
      <div className="flex flex-col gap-8">
        {!stocksDisplayed && (
          <div className="flex gap-4">
            <input
              value={Stock1}
              className="border rounded-md p-4 border-gray-800"
              placeholder="ticker1"
              onChange={(e) => setStock1(e.target.value)}
            ></input>
            <input
              value={Stock2}
              className="border rounded-md p-4 border-gray-800"
              placeholder="ticker2"
              onChange={(e) => setStock2(e.target.value)}
            ></input>
          </div>
        )}
        {stocksDisplayed ? (
          <button
            onClick={() => setStocksDisplayed(false)}
            className="p-4 bg-red-700 hover:bg-red-600 text-white rounded-md"
          >
            Reset
          </button>
        ) : (
          <button
            onClick={handleAnalyze}
            disabled={Stock1.length == 0 || Stock2.length == 0}
            className="p-4 disabled:bg-gray-500 bg-green-700 hover:bg-green-600 text-white rounded-md"
          >
            Analyze stocks
          </button>
        )}
      </div>
      {stocksDisplayed && (
        <div className="flex w-full items-center justify-around">
          <div>
            <p className="font-bold underline">{Stock1} Financials</p>
            <p>Assets: {formatter.format(Stock1Data.bs[11].value)}</p>
          </div>
          <div>
            <p className="font-bold underline">{Stock2} Financials</p>
            <p>Assets: {formatter.format(Stock2Data.bs[11].value)}</p>
          </div>
        </div>
      )}
    </main>
  );
}
