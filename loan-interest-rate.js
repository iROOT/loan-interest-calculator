/**
* Вычисляет эквивалентную годовую процентную ставку по кредиту.
*
* @param {number} loanAmount Сумма займа.
* @param {number} monthlyPayment Ежемесячный платеж.
* @param {number} loanTermYears Срок займа в годах.
* @param {number} [tolerance=0.0001] Допустимая погрешность для поиска ставки.
* @param {number} [maxIterations=100] Максимальное количество итераций для поиска.
* @returns {number|null} Годовая процентная ставка в процентах (например, 5.5),
* или null, если не удалось найти ставку.
*/
export function calculateEquivalentInterestRate(
    loanAmount,
    monthlyPayment,
    loanTermYears,
    tolerance = 0.0001,
    maxIterations = 100
) {
    if (
        loanAmount <= 0 ||
        monthlyPayment <= 0 ||
        loanTermYears <= 0
    ) {
        throw new Error('Некорректные входные данные.');
        return null;
    }
    
    const numberOfPayments = loanTermYears * 12;
    
    // Определяем границы для поиска процентной ставки (годовая в долях)
    let lowRate = 0;
    let highRate = 1; // Максимально возможная ставка (100%)
    
    for (let i = 0; i < maxIterations; i++) {
        const midRate = (lowRate + highRate) / 2;
        const monthlyInterestRate = midRate / 12;
        
        // Формула для расчета ежемесячного платежа по заданной процентной ставке
        const calculatedMonthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))
        / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        if (isNaN(calculatedMonthlyPayment) || !isFinite(calculatedMonthlyPayment)) {
            highRate = midRate; // Попробуем более низкую ставку
            continue;
        }
        
        const difference = calculatedMonthlyPayment - monthlyPayment;
        
        if (Math.abs(difference) < tolerance) {
            return midRate * 100; // Возвращаем годовую ставку в процентах
        } else if (difference > 0) {
            highRate = midRate; // Слишком высокий платеж, нужна меньшая ставка
        } else {
            lowRate = midRate; // Слишком низкий платеж, нужна большая ставка
        }
    }
    
    throw new Error('Не удалось найти эквивалентную процентную ставку за заданное количество итераций.');
}
