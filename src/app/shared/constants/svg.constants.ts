import { BANDERA_AUSTRALIA, BANDERA_CANADA, BANDERA_CHINA, BANDERA_EUROPA, BANDERA_INDIA, BANDERA_JAPON, BANDERA_NUEVA_ZELANDA, BANDERA_REINO_UNIDO, BANDERA_SUIZA, BANDERA_USA } from "src/assets/SVGs";
import { DivisaCodigoENUM } from "../enums/Divisa.enum";

const divisaCodigo = DivisaCodigoENUM

export const BANDERAS = [
  {codigoDivisa: divisaCodigo.USD, svg: BANDERA_USA},
  {codigoDivisa: divisaCodigo.AUD, svg: BANDERA_AUSTRALIA},
  {codigoDivisa: divisaCodigo.JPY, svg: BANDERA_JAPON},
  {codigoDivisa: divisaCodigo.EUR, svg: BANDERA_EUROPA},
  {codigoDivisa: divisaCodigo.INR, svg: BANDERA_INDIA},
  {codigoDivisa: divisaCodigo.CNY, svg: BANDERA_CHINA},
  {codigoDivisa: divisaCodigo.NZD, svg: BANDERA_NUEVA_ZELANDA},
  {codigoDivisa: divisaCodigo.CHF, svg: BANDERA_SUIZA},
  {codigoDivisa: divisaCodigo.CAD, svg: BANDERA_CANADA},
  {codigoDivisa: divisaCodigo.GBP, svg: BANDERA_REINO_UNIDO}
]