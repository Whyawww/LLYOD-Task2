import React, { useState, useMemo } from 'react';
import DonutChart from './components/DonutChart';
import { calculateMortgage } from './utils/calculations';

const App = () => {
  const [data, setData] = useState({
    price: 135700,
    downPayment: 20,
    term: 10,
    rate: 3.5,
    type: 'fixed',
    additionalFees: '',
    vatId: '',
    prepayment: ''
  });

  const results = useMemo(() => 
    calculateMortgage(data.price, data.downPayment, data.term, data.type, data.rate), 
    [data]
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center mb-10 w-full">
          <img src="/logo.webp" alt="Lloyds Bank Logo" className="h-10 w-auto object-contain" />
          <h1 className="hidden md:block text-xl font-bold text-gray-700">Mortgage Planning Tool</h1>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 italic uppercase">Calculate your home's mortgage plan</h1>
        </div>

        {/* Step Progress */}
        <div className="bg-[#d1d5db] rounded-3xl p-6 flex items-center w-full shadow-inner">
          {[ { id: 1, label: 'Data Input' }, { id: 2, label: 'Select an Option' }, { id: 3, label: 'Results' } ].map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center z-10 shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-lg shadow-sm ${step.id === 1 ? 'bg-black text-white scale-110' : 'bg-[#4b5563] text-white opacity-80'}`}>
                  {step.id}
                </div>
                <span className={`text-xs md:text-sm font-bold tracking-tight ${step.id === 1 ? 'text-black' : 'text-gray-500'}`}>{step.label}</span>
              </div>
              {idx < 2 && (
                <div className="flex-1 flex items-center px-1 md:px-4">
                  <div className="flex-1 h-[2px] bg-gray-400 rounded-full" />
                  <div className="px-3 opacity-25 shrink-0"><svg width="18" height="30" viewBox="0 0 20 60" fill="none" className="w-auto h-6 md:h-8"><path d="M0 0L10 30L0 60H10L20 30L10 0H0Z" fill="currentColor"/></svg></div>
                  <div className="flex-1 h-[2px] bg-gray-400 rounded-full" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-7 space-y-12">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight underline decoration-green-500 underline-offset-8">Enter Your Mortgage Details</h2>
            
            <div className="space-y-10">
              {/* Fields: Price, Down Payment, Term, Interest Rate */}
              {[
                { label: 'Property Prices (£)', key: 'price', min: 0, max: 1000000, step: 1000 },
                { label: 'Down Payment (%)', key: 'downPayment', min: 0, max: 99, step: 1 },
                { label: 'Term (Years)', key: 'term', min: 1, max: 40, step: 1 },
                { label: 'Interest Rate (%)', key: 'rate', min: 0.1, max: 15, step: 0.1 }
              ].map((input) => (
                <div key={input.key} className="flex flex-col md:flex-row gap-6 items-end group">
                  <div className="flex-1 space-y-4 w-full">
                    <label className="font-bold text-gray-800">{input.label}</label>
                    <input
                      type="range" {...input} value={data[input.key]}
                      onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006a4d] transition-all"
                    />
                  </div>
                  <div className="w-full md:w-36">
                    <input
                      type="number" value={data[input.key]}
                      onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-black text-center text-lg focus:border-[#006a4d] outline-none shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Interest Toggle */}
            <div className="space-y-4">
              <label className="font-bold text-gray-800">Mortgage Type</label>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border-2 border-gray-200 gap-2">
                {[
                  {id: 'fixed', label: 'FIXED RATE'},
                  {id: 'floating', label: 'VARIABLE'},
                  {id: 'interest-only', label: 'INTEREST ONLY'}
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setData({...data, type: btn.id})}
                    className={`flex-1 py-4 font-black text-[10px] md:text-sm rounded-xl transition-all ${data.type === btn.id ? 'bg-[#006a4d] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  > {btn.label} </button>
                ))}
              </div>
            </div>

            {/* Advanced Section */}
            <div className="bg-[#f9fafb] rounded-[2rem] p-8 border border-gray-200 space-y-6">
              <h3 className="text-lg font-black text-gray-800 uppercase">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Additional fees (e.g. 500)" className="bg-white border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#006a4d]" />
                <input type="text" placeholder="Prepayment Options" className="bg-white border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#006a4d]" />
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white border-4 border-gray-100 rounded-[3rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <h3 className="text-2xl font-black italic tracking-tighter">Summary Card</h3>
                <div className="space-y-1 relative">
                  <p className="text-gray-400 text-xs font-bold uppercase">Monthly Payment</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">£ {results.monthlyPayment.toLocaleString()}</p>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs font-bold text-[#006a4d]">Total Payment: £{(results.totalPayment / 1000).toFixed(1)}k</span>
                    <span className="text-xs text-gray-400 font-medium">Total Interest: £{(results.totalInterest / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                <div className="py-4"><DonutChart interest={results.totalInterest} principal={results.loanAmount} /></div>
                <div className="text-center font-black text-[10px] text-gray-400 tracking-widest border-t pt-4">INTEREST RATIO: {results.interestPercent}%</div>
              </div>
              <button className="w-full py-5 bg-[#006a4d] text-white font-black rounded-2xl shadow-xl hover:bg-green-900 transition-all active:scale-[0.98]">
                CALCULATE FULL PLAN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;