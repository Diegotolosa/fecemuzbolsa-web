// Este código calcula cuánto vale el S&P 500 en euros comparado con el primer día
const PRECIO_INICIAL_EUR = 4444.44; // El precio del día que empezaste

export function calcularBase100(precioHoyUSD: number, cambioEURUSD: number) {
  // 1. Convertimos el precio de hoy a euros
  const precioHoyEUR = precioHoyUSD / cambioEURUSD;
  
  // 2. Calculamos el rendimiento relativo (Base 100)
  const resultadoBase100 = (precioHoyEUR / PRECIO_INICIAL_EUR) * 100;
  
  return {
    precioEUR: precioHoyEUR,
    valorGrafica: resultadoBase100
  };
}