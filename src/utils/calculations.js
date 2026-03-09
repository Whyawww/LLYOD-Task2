export const calculateMortgage = (price, downPaymentPct, years, interestType, annualRatePct) => {
    const loanAmount = price * (1 - downPaymentPct / 100);
    
    const annualRate = annualRatePct / 100;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = years * 12;
  
    let monthlyPayment = 0;

    if (interestType === 'interest-only') {
        monthlyPayment = loanAmount * monthlyRate;
    } else {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
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