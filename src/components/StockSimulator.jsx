import  { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockSimulator = () => {
  // サンプルの株価データ (2024年の架空データ)
  const [stockData] = useState([
    { date: '2024-01', price: 2800, volume: 1000000 },
    { date: '2024-02', price: 2950, volume: 1200000 },
    { date: '2024-03', price: 2850, volume: 900000 },
    { date: '2024-04', price: 3100, volume: 1500000 },
    { date: '2024-05', price: 3000, volume: 1100000 },
    { date: '2024-06', price: 3200, volume: 1300000 }
  ]);

  const [investment, setInvestment] = useState({
    shares: 0,
    avgPrice: 0,
    cash: 100000 // 初期資金10万円
  });

  const [selectedMonth, setSelectedMonth] = useState(0);

  const handleBuy = () => {
    const currentPrice = stockData[selectedMonth].price;
    if (investment.cash >= currentPrice) {
      setInvestment({
        shares: investment.shares + 1,
        avgPrice: ((investment.shares * investment.avgPrice) + currentPrice) / (investment.shares + 1),
        cash: investment.cash - currentPrice
      });
    }
  };

  const handleSell = () => {
    if (investment.shares > 0) {
      const currentPrice = stockData[selectedMonth].price;
      setInvestment({
        shares: investment.shares - 1,
        avgPrice: investment.shares > 1 ? investment.avgPrice : 0,
        cash: investment.cash + currentPrice
      });
    }
  };

  const calculateProfit = () => {
    const currentPrice = stockData[selectedMonth].price;
    const totalValue = (investment.shares * currentPrice) + investment.cash;
    return totalValue - 100000; // 初期資金との差額
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">株式投資シミュレーター</h2>
      </div>
      
      <div className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" name="株価" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">ポートフォリオ状況</h3>
          <p className="mb-2">保有株数: {investment.shares}株</p>
          <p className="mb-2">平均取得価格: ¥{investment.avgPrice.toFixed(0)}</p>
          <p className="mb-2">現金残高: ¥{investment.cash.toFixed(0)}</p>
          <p className="mb-2">損益: ¥{calculateProfit().toFixed(0)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">取引</h3>
          <div className="flex gap-2">
            <button 
              onClick={handleBuy}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={investment.cash < stockData[selectedMonth].price}
            >
              買付
            </button>
            <button 
              onClick={handleSell}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={investment.shares === 0}
            >
              売却
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <input 
          type="range" 
          min="0" 
          max={stockData.length - 1} 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="w-full mb-2"
        />
        <p className="text-center mb-1">現在の月: {stockData[selectedMonth].date}</p>
        <p className="text-center">現在値: ¥{stockData[selectedMonth].price}</p>
      </div>
    </div>
  );
};

export default StockSimulator;