import { IncomeOrExpense } from "src/app/finanzasPersonales/mis-ingresos-gastos/interfaces/IncomeOrExpense.interface";
import { CurrencyExchange } from "../services/CurrencyExchange/CurrencyExchange.interface";

export function convertCurrenciesIntoSingle(
  transactions: IncomeOrExpense[], 
  targetCurrency: CurrencyExchange, 
): IncomeOrExpense[] {
  return transactions.map(transaction => {

    // No convertir si la divisa es la misma que la divisa destino
    if (transaction.currency === targetCurrency.currencyCode) {
      return transaction
    }

    // Convertir a USD
    const amountInUsd = transaction.amount / transaction.exchangeRateToUsd

    // Convertir de USD a la divisa destino
    const convertedAmount = amountInUsd * targetCurrency.exchangeRateToUsd

    return {
      ...transaction,
      amount: convertedAmount,
      currency: targetCurrency.currencyCode
    }

  })
}
