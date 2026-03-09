import React, { useState, useMemo } from 'react';
import DonutChart from './components/DonutChart';
import { calculateMortgage } from './utils/calculations';

const Tooltip = ({ text }) => (
  <div className="group relative ml-2 inline-block no-print">
    <span className="cursor-help rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:bg-[#006a4d] hover:text-white transition-colors">?</span>
    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg bg-gray-800 p-2 text-center text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
      {text}
      <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-gray-800" />
    </div>
  </div>
);

const App = () => {
  const [data, setData] = useState({
    price: 150000,
    downPayment: 20,
    term: 25,
    rate: 3.5,
    type: 'fixed',
    additionalFees: '',
    vatId: '',
    prepayment: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const results = useMemo(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 300);
    return calculateMortgage(data.price, data.downPayment, data.term, data.type, data.rate);
  }, [data]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const content = `
    LLOYDS BANK - MORTGAGE SUMMARY
    ------------------------------
    Property Value: £${data.price.toLocaleString()}
    Down Payment: ${data.downPayment}% (£${results.loanAmount.toLocaleString()})
    Term: ${data.term} Years
    Interest Rate: ${data.rate}% (${data.type.toUpperCase()})
    
    RESULTS:
    Monthly Repayment: £${results.monthlyPayment.toLocaleString()}
    Total Amount Payable: £${results.totalPayment.toLocaleString()}
    Total Interest: £${results.totalInterest.toLocaleString()}
    
    Generated on: ${new Date().toLocaleDateString()}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lloyds_Mortgage_Summary.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans transition-colors duration-700">
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-float { animation: subtle-float 4s ease-in-out infinite; }
        .pulse-ring::before {
          content: '';
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          background-color: #006a4d;
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6 w-full border-b border-gray-200 pb-4 no-print">
          <img src="/logo.webp" alt="Lloyds Bank" className="h-10 w-auto object-contain" />
          <h1 className="text-sm font-bold text-[#006a4d] uppercase tracking-widest">Mortgage Calculator</h1>
        </div>

        {/* Step Progress */}
        <div className="bg-white rounded-3xl p-6 flex items-center w-full shadow-sm border border-gray-100 no-print">
          {[ { id: 1, label: 'Input' }, { id: 2, label: 'Options' }, { id: 3, label: 'Review' } ].map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step.id === 1 ? 'bg-[#006a4d] text-white animate-pulse-custom scale-110' : 'bg-gray-100 text-gray-400'}`}>
                  {step.id}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${step.id === 1 ? 'text-[#006a4d]' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {idx < 2 && <div className="flex-1 h-[1px] bg-gray-200 mx-4" />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          <div className="lg:col-span-7 space-y-12 no-print">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              Calculation Parameters
              <span className="h-1 w-10 bg-[#006a4d] rounded-full" />
            </h2>
            
            <div className="space-y-10">
              {[
                { label: 'Property Value (£)', key: 'price', min: 10000, max: 1000000, step: 1000, hint: 'The market price of the home.' },
                { label: 'Deposit (%)', key: 'downPayment', min: 0, max: 95, step: 1, hint: 'Percentage paid upfront.' },
                { label: 'Loan Term (Years)', key: 'term', min: 1, max: 40, step: 1, hint: 'Duration of the loan repayment.' },
                { label: 'Interest Rate (%)', key: 'rate', min: 0.1, max: 15, step: 0.1, hint: 'Your expected annual percentage rate.' }
              ].map((input) => (
                <div key={input.key} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center">
                      {input.label}
                      <Tooltip text={input.hint} />
                    </label>
                    <input
                      type="number" value={data[input.key]}
                      onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                      className="w-24 bg-gray-50 border-2 border-gray-100 rounded-lg p-2 font-bold text-center text-[#006a4d]"
                    />
                  </div>
                  <input
                    type="range" {...input} value={data[input.key]}
                    onChange={(e) => setData({...data, [input.key]: Number(e.target.value)})}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#006a4d]"
                  />
                </div>
              ))}
            </div>

            {/* Mortgage Type */}
            <div className="space-y-4 no-print">
              <label className="text-xs font-black text-gray-800 uppercase tracking-widest">Mortgage Strategy</label>
              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                {[
                  { id: 'fixed', label: 'FIXED RATE' },
                  { id: 'adjustable', label: 'ADJUSTABLE' },
                  { id: 'interest-only', label: 'INTEREST ONLY' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setData({ ...data, type: btn.id })}
                    className={`py-3 px-1 font-bold text-[9px] md:text-xs rounded-xl transition-all duration-500 transform ${
                      data.type === btn.id ? 'bg-[#006a4d] text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="advanced-section bg-[#f9fafb] rounded-[2rem] p-8 border border-gray-200 space-y-6">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Additional Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" placeholder="Fees (£)" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:border-[#006a4d] outline-none" />
                <input type="text" placeholder="VAT/GST ID" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:border-[#006a4d] outline-none" />
                <input type="number" placeholder="Prepay (£)" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:border-[#006a4d] outline-none" />
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className={`summary-card bg-[#006a4d] rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden text-white transition-all duration-500 ${isUpdating ? 'scale-[1.03] brightness-110' : 'scale-100 animate-float'}`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 no-print animate-pulse" />
                
                <h3 className="text-xl font-black italic opacity-70 tracking-tighter">Live Summary</h3>
                
                <div className="space-y-1">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Monthly Repayment</p>
                  <p className={`text-6xl font-black tracking-tighter transition-all duration-300 ${isUpdating ? 'translate-y-[-5px] opacity-80' : 'translate-y-0 opacity-100'}`}>
                    £{results.monthlyPayment.toLocaleString()}
                  </p>
                  <div className="flex flex-col gap-3 mt-8 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-xs items-center">
                      <span className="opacity-70 font-medium">Total Payable</span>
                      <span className="font-black text-lg">£{results.totalPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="opacity-70 font-medium">Total Interest</span>
                      <span className="font-black text-lg">£{results.totalInterest.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md no-print border border-white/5 hover:bg-white/20 transition-all duration-500">
                   <DonutChart interest={results.totalInterest} principal={results.loanAmount} />
                </div>
              </div>

              {/* Action Buttons: Save & Print */}
              <div className="space-y-3 no-print">
                <button className="w-full py-5 bg-[#006a4d] text-white font-black rounded-2xl shadow-xl hover:bg-[#00523b] transition-all uppercase tracking-widest text-xs">
                  Apply Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleSave} className="py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-[10px] uppercase">
                    Save Calculation
                  </button>
                  <button onClick={handlePrint} className="py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-[10px] uppercase">
                    Print Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;