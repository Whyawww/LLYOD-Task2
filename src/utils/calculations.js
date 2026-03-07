export const calculateMortgage = (price, downPaymentPct, years, interestType) => {
    const loanAmount = price * (1 - downPaymentPct / 100);
    const annualRate = interestType === 'fixed' ? 0.035 : 0.05;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = years * 12;
  
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
  
    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      interestPercent: ((totalInterest / totalPayment) * 100).toFixed(0)
    };
  };