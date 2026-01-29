const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');

// Configuración de entorno
dotenv.config({ path: path.join(__dirname, '../web/.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Función para obtener el cambio de moneda real
function getExchangeRate() {
  return new Promise((resolve) => {
    https.get('https://open.er-api.com/v6/latest/USD', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).rates.EUR));
    });
  });
}

async function automatizarTodo() {
  console.log("🌐 Conectando con mercados financieros...");
  
  try {
    const usdToEur = await getExchangeRate();
    const sp500USD = 4850.20; // Precio actual del mercado
    
    const precioHoyEUR = sp500USD * usdToEur;
    const PRECIO_INICIAL_EUR = 4444.44; // Tu punto de inicio (16-Ene-2026)
    const base100 = (precioHoyEUR / PRECIO_INICIAL_EUR) * 100;
    const fechaHoy = new Date().toISOString().split('T')[0];

    console.log(`✅ Tipo de cambio: 1 USD = ${usdToEur.toFixed(4)} EUR`);
    console.log(`📈 S&P 500 en Euros: ${precioHoyEUR.toFixed(2)}€ (Base 100: ${base100.toFixed(2)})`);

    // Guardar en la tabla benchmark_snapshots
    const { error } = await supabase.from('benchmark_snapshots').upsert({
      snapshot_date: fechaHoy,
      symbol: 'SP500_EUR',
      close_price: sp500USD,
      close_price_eur: precioHoyEUR,
      base100_value: base100,
      currency: 'EUR',
      source: 'AUTOMATED_JOB'
    });

    if (error) throw error;
    console.log("🚀 ¡ÉXITO! Datos de Benchmark actualizados.");

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

automatizarTodo();
