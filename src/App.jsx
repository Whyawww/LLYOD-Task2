import React, { useState, useMemo } from 'react';
import DonutChart from './components/DonutChart';
import { calculateMortgage } from './utils/calculations';

const App = () => {
  const [data, setData] = useState({
    price: 135700,
    downPayment: 20,
    term: 10,
    type: 'fixed',
    additionalFees: '',
    vatId: '',
    prepayment: ''
  });

  const results = useMemo(() => 
    calculateMortgage(data.price, data.downPayment, data.term, data.type), 
    [data.price, data.downPayment, data.term, data.type]
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center mb-10 w-full">
          <img 
            src="/logo.webp" 
            alt="Lloyds Bank Logo" 
            className="h-20 w-auto object-contain"
          />
          <h1 className="hidden md:block text-xl font-bold text-gray-700">
            Mortgage Planning Tool
          </h1>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 italic">
            Calculate your home's mortgage plan
          </h1>
        </div>

        {/* Step Progress */}
        <div className="bg-[#d1d5db] rounded-3xl p-6 flex items-center w-full shadow-inner">
          {[
            { id: 1, label: 'Data Input' },
            { id: 2, label: 'Select an Option' },
            { id: 3, label: 'Results' }
          ].map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center z-10 shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-lg shadow-sm transition-all duration-300 ${step.id === 1 ? 'bg-black text-white scale-110' : 'bg-[#4b5563] text-white opacity-80'}`}>
                  {step.id}
                </div>
                <span className={`text-xs md:text-sm font-bold tracking-tight ${step.id === 1 ? 'text-black' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>

              {idx < 2 && (
                <div className="flex-1 flex items-center px-1 md:px-4">
                  <div className="flex-1 h-[2px] bg-gray-400 rounded-full" />
                  <div className="px-3 opacity-25 shrink-0">
                    <svg width="18" height="30" viewBox="0 0 20 60" fill="none" className="w-auto h-6 md:h-8">
                      <path d="M0 0L10 30L0 60H10L20 30L10 0H0Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-gray-400 rounded-full" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-12">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Enter Your Mortgage Details</h2>
            
            <div className="space-y-10">
              {[
                { label: 'Property Prices (£)', key: 'price', min: 25000, max: 500000, step: 1000 },
                { label: 'Down Payment (%)', key: 'downPayment', min: 0, max: 50, step: 1 },
                { label: 'Term (Years)', key: 'term', min: 1, max: 35, step: 1 }
              ].map((input) => (
                <div key={input.key} className="flex flex-col md:flex-row gap-6 items-end group">
                  <div className="flex-1 space-y-4 w-full">
                    <label className="font-bold text-gray-800 flex justify-between">
                      {input.label}
                      <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest md:hidden">Slide to adjust</span>
                    </label>
                    <input
                      type="range" {...input} value={data[input.key]}
                      onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006a4d] hover:accent-green-700 transition-all"
                    />
                  </div>
                  <div className="w-full md:w-36">
                    <label className="text-[10px] text-gray-400 block mb-1 font-bold uppercase tracking-tighter">Numerical (£)</label>
                    <input
                      type="number" value={data[input.key]}
                      onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-black text-center text-lg focus:border-[#006a4d] focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Interest Toggle */}
            <div className="space-y-4">
              <label className="font-bold text-gray-800">Interest Rate Type</label>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border-2 border-gray-200">
                <button
                  onClick={() => setData({...data, type: 'fixed'})}
                  className={`flex-1 py-4 font-black text-sm rounded-xl transition-all duration-300 ${data.type === 'fixed' ? 'bg-[#006a4d] text-white shadow-lg translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600'}`}
                > FIXED RATE </button>
                <button
                  onClick={() => setData({...data, type: 'floating'})}
                  className={`flex-1 py-4 font-black text-sm rounded-xl transition-all duration-300 ${data.type === 'floating' ? 'bg-[#006a4d] text-white shadow-lg translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600'}`}
                > VARIABLE RATE </button>
              </div>
            </div>

            {/* Advanced Section */}
            <div className="bg-[#f9fafb] rounded-[2rem] p-8 border border-gray-200 space-y-6">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Additional fees</label>
                  <input 
                    type="text" placeholder="e.g. 500" value={data.additionalFees}
                    onChange={(e) => setData({...data, additionalFees: e.target.value})}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#006a4d] transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">VAT/GST ID</label>
                  <input 
                    type="text" placeholder="ID Number" value={data.vatId}
                    onChange={(e) => setData({...data, vatId: e.target.value})}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#006a4d] transition-all" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Prepayment Options</label>
                  <input 
                    type="text" placeholder="Monthly extra payment (e.g. 200)" value={data.prepayment}
                    onChange={(e) => setData({...data, prepayment: e.target.value})}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 font-semibold outline-none focus:border-[#006a4d] transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white border-4 border-gray-100 rounded-[3rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50" />
                
                <h3 className="text-2xl font-black italic tracking-tighter">Summary Card</h3>
                
                <div className="space-y-1 relative">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Estimated Total Payment</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">£ {(results.totalPayment / 1000).toFixed(1)}k</p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs font-bold bg-green-100 text-[#006a4d] px-3 py-1 rounded-full">
                      Interest: {results.interestPercent}%
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      £{(results.totalInterest / 1000).toFixed(1)}k total interest
                    </span>
                  </div>
                </div>

                <div className="py-4">
                   <DonutChart interest={results.totalInterest} principal={results.loanAmount} />
                </div>

                <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#2dd4bf] rounded-full shadow-sm"/> 
                    <span className="text-gray-600">Interest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#3b82f6] rounded-full shadow-sm"/> 
                    <span className="text-gray-600">Principal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-5 bg-[#d1d5db] text-gray-900 font-black rounded-2xl hover:bg-gray-300 transition-all active:scale-[0.98] tracking-tight">
                  NEXT: SELECT LOAN OPTIONS
                </button>
                <button className="w-full py-5 bg-[#d1d5db] text-gray-900 font-black rounded-2xl hover:bg-gray-300 transition-all active:scale-[0.98] tracking-tight">
                  COMPARE THESE OPTIONS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;