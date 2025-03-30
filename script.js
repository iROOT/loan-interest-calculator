import { calculateEquivalentInterestRate } from './loan-interest-rate.js';

document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const monthlyPaymentInput = document.getElementById('monthlyPayment');
    const loanTermInput = document.getElementById('loanTerm');
    const termYearsRadio = document.getElementById('termYears');
    const termMonthsRadio = document.getElementById('termMonths');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    const numberFormatter = new Intl.NumberFormat('ru-RU');

    const formatInputValue = (inputElement) => {
        const rawValue = inputElement.value.replace(/\D/g, '');
        if (rawValue) {
            const formattedValue = numberFormatter.format(parseInt(rawValue, 10));
            inputElement.value = formattedValue;
        } else {
            inputElement.value = '';
        }
    };

    loanAmountInput.addEventListener('input', () => {
        formatInputValue(loanAmountInput);
    });

    monthlyPaymentInput.addEventListener('input', () => {
        formatInputValue(monthlyPaymentInput);
    });

    calculateBtn.addEventListener('click', () => {
        const loanAmountRaw = loanAmountInput.value.replace(/\D/g, '');
        const monthlyPaymentRaw = monthlyPaymentInput.value.replace(/\D/g, '');
        const loanAmount = parseFloat(loanAmountRaw);
        const monthlyPayment = parseFloat(monthlyPaymentRaw);
        const loanTerm = parseInt(loanTermInput.value, 10);
        let loanTermYears;

        if (termYearsRadio.checked) {
            loanTermYears = loanTerm;
        } else if (termMonthsRadio.checked) {
            loanTermYears = loanTerm / 12;
        } else {
            errorDiv.textContent = 'Пожалуйста, выберите единицу срока займа.';
            errorDiv.classList.remove('hidden');
            return;
        }

        errorDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        resultDiv.textContent = '';

        if (isNaN(loanAmount) || isNaN(monthlyPayment) || isNaN(loanTerm) ||
            loanAmount <= 0 || monthlyPayment <= 0 || loanTerm <= 0) {
            errorDiv.textContent = 'Пожалуйста, введите корректные числовые значения больше нуля.';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        try {
            const interestRate = calculateEquivalentInterestRate(
                loanAmount,
                monthlyPayment,
                loanTermYears
            );

            resultDiv.textContent = `Эквивалентная годовая процентная ставка: ${interestRate.toFixed(2)}%`;
            resultDiv.classList.remove('hidden');
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
});
