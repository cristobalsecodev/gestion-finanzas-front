import { IncomeOrExpense } from "src/app/finanzasPersonales/mis-ingresos-gastos/interfaces/IncomeOrExpense.interface";
import { CurrencyExchange } from "../services/CurrencyExchange/CurrencyExchange.interface";

export function convertCurrenciesIntoSingle(
  transactions: IncomeOrExpense[], 
  targetCurrency: CurrencyExchange, 
): IncomeOrExpense[] {
  return transactions.map(transaction => {
    
    if (transaction.currency === targetCurrency.currencyCode) {
      return transaction
    }

    // Convertir a USD (sin redondeo intermedio)
    const amountInUsd = transaction.amount / transaction.exchangeRateToUsd

    // Convertir de USD a la divisa destino (manteniendo precisión)
    const convertedAmount = amountInUsd * targetCurrency.exchangeRateToUsd

    return {
      ...transaction,
      amount: convertedAmount, 
      currency: targetCurrency.currencyCode
    }
  }).map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount.toFixed(2))
  }))
}