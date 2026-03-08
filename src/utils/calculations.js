export const calculateMortgage = (price, downPaymentPct, years, interestType, annualRatePct) => {
  const p = price || 0;
  const dp = downPaymentPct || 0;
  const t = years || 0;
  const r = annualRatePct || 0;

  const loanAmount = p * (1 - dp / 100);
  const monthlyRate = (r / 100) / 12;
  const numberOfPayments = t * 12;

  let monthlyPayment = 0;
  
  if (loanAmount > 0 && r > 0 && t > 0) {
      if (interestType === 'interest-only') {
          monthlyPayment = loanAmount * monthlyRate;
      } else {
          monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
  }

  const totalPayment = interestType === 'interest-only' 
      ? (monthlyPayment * numberOfPayments) + loanAmount 
      : (monthlyPayment * numberOfPayments);
      
  const totalInterest = totalPayment - loanAmount;

  return {
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      loanAmount: Number(loanAmount.toFixed(2)),
      interestPercent: totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(0) : 0
  };
};