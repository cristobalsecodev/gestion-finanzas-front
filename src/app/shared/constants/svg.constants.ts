import { FLAG_AUSTRALIA, FLAG_CANADA, FLAG_CHINA, FLAG_EUROPE, FLAG_INDIA, FLAG_JAPAN, FLAG_NEW_ZELAND, FLAG_SWISS, FLAG_UK, FLAG_USA } from "src/assets/SVGs";
import { CurrencyCodeENUM } from "../enums/Currency.enum";

const currencyCode = CurrencyCodeENUM

export const FLAGS = [
  {currencyCode: currencyCode.USD, svg: FLAG_USA},
  {currencyCode: currencyCode.AUD, svg: FLAG_AUSTRALIA},
  {currencyCode: currencyCode.JPY, svg: FLAG_JAPAN},
  {currencyCode: currencyCode.EUR, svg: FLAG_EUROPE},
  {currencyCode: currencyCode.INR, svg: FLAG_INDIA},
  {currencyCode: currencyCode.CNY, svg: FLAG_CHINA},
  {currencyCode: currencyCode.NZD, svg: FLAG_NEW_ZELAND},
  {currencyCode: currencyCode.CHF, svg: FLAG_SWISS},
  {currencyCode: currencyCode.CAD, svg: FLAG_CANADA},
  {currencyCode: currencyCode.GBP, svg: FLAG_UK}
]
