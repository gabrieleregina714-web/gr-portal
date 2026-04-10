/**
 * fic-create-invoice.js
 * Crea una fattura su Fatture in Cloud da un ordine Shopify.
 * Uso: node fic-create-invoice.js <shopify_order_id>
 * Esempio: node fic-create-invoice.js 6123456789
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Config ────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const get = (key) => { const m = envContent.match(new RegExp(`^${key}=(.+)$`, 'm')); return m ? m[1].trim() : null; };

const FIC_TOKEN     = get('FIC_ACCESS_TOKEN');
const FIC_COMPANY   = get('FIC_COMPANY_ID') || '1581421';
const SHOPIFY_TOKEN = get('SHOPIFY_ADMIN_TOKEN') || get('SHOPIFY_TOKEN');
const SHOPIFY_STORE = 'grperform.myshopify.com';
const SHOPIFY_API   = '2024-01';

if (!FIC_TOKEN) { console.error('❌ FIC_ACCESS_TOKEN mancante in .env.local'); process.exit(1); }

// ─── Helpers ───────────────────────────────────────────────────────────────
function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = { hostname, path, method: 'GET', headers: { 'Accept': 'application/json', ...headers } };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function httpsPost(hostname, path, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const opts = {
      hostname, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Content-Length': Buffer.byteLength(postData), ...headers }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const orderId = process.argv[2];
  if (!orderId) { console.error('Uso: node fic-create-invoice.js <shopify_order_id>'); process.exit(1); }

  // 1. Recupera ordine da Shopify
  console.log(`\n📦 Recupero ordine Shopify #${orderId}...`);
  const shopifyRes = await httpsGet(
    SHOPIFY_STORE,
    `/admin/api/${SHOPIFY_API}/orders/${orderId}.json`,
    { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
  );
  if (shopifyRes.status !== 200) {
    console.error('❌ Errore Shopify:', shopifyRes.status, JSON.stringify(shopifyRes.body).substring(0, 200));
    process.exit(1);
  }
  const order = shopifyRes.body.order;
  console.log(`   Ordine: #${order.order_number} — ${order.email}`);
  console.log(`   Totale: €${order.total_price}`);

  // 2. Estrai dati cliente
  const billing = order.billing_address || order.shipping_address || {};
  const cf = (order.note_attributes || []).find(a => a.name === 'Codice Fiscale')?.value
          || (order.cart_attributes || []).find(a => a.name === 'Codice Fiscale')?.value
          || order.customer?.tax_exemptions?.join('') || '';

  // Fallback su order.customer se billing_address non ha nome (ordini digitali/ebook)
  const firstName = billing.first_name || order.customer?.first_name || '';
  const lastName  = billing.last_name  || order.customer?.last_name  || '';

  // Ultimo fallback: credit_card_name dalla prima transazione (nome sulla carta)
  let cardName = '';
  if (!firstName && !lastName) {
    const txRes = await httpsGet(
      SHOPIFY_STORE,
      `/admin/api/${SHOPIFY_API}/orders/${order.id}/transactions.json?fields=payment_details`,
      { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
    );
    if (txRes.status === 200 && txRes.body.transactions?.length > 0) {
      cardName = txRes.body.transactions[0]?.payment_details?.credit_card_name || '';
      if (cardName) console.log(`   (nome dalla carta: ${cardName})`);
    }
  }

  const customerName = billing.company
    ? billing.company
    : (`${firstName} ${lastName}`.trim() || cardName || order.email || 'Cliente').trim();

  console.log(`   Cliente: ${customerName}`);
  console.log(`   CF: ${cf || '(non trovato)'}`);

  // 3. Cerca o crea cliente su FIC
  console.log('\n👤 Ricerca cliente su FIC...');
  const searchRes = await httpsGet(
    'api-v2.fattureincloud.it',
    `/c/${FIC_COMPANY}/entities/clients?q=${encodeURIComponent(order.email)}&fields=id,name,email,tax_code`,
    { 'Authorization': `Bearer ${FIC_TOKEN}` }
  );

  let clientId = null;
  if (searchRes.status === 200 && searchRes.body.data && searchRes.body.data.length > 0) {
    clientId = searchRes.body.data[0].id;
    console.log(`   Trovato: ID ${clientId} — ${searchRes.body.data[0].name}`);
  } else {
    console.log('   Non trovato, creo nuovo cliente...');
    const newClient = {
      data: {
        name: customerName,
        email: order.email,
        tax_code: cf || undefined,
        vat_number: undefined,
        address_street: billing.address1 || '',
        address_city: billing.city || '',
        address_postal_code: billing.zip || '',
        address_province: billing.province_code || '',
        address_country: billing.country_code || 'IT',
      }
    };
    const createRes = await httpsPost(
      'api-v2.fattureincloud.it',
      `/c/${FIC_COMPANY}/entities/clients`,
      newClient,
      { 'Authorization': `Bearer ${FIC_TOKEN}` }
    );
    if (createRes.status !== 200 && createRes.status !== 201) {
      console.error('❌ Errore creazione cliente:', createRes.status, JSON.stringify(createRes.body).substring(0, 300));
      process.exit(1);
    }
    clientId = createRes.body.data.id;
    console.log(`   Creato: ID ${clientId}`);
  }

  // 4. Prepara righe fattura
  const items = order.line_items.map(item => ({
    product_id: null,
    name: item.name,
    qty: item.quantity,
    measure: 'pz',
    net_price: parseFloat(item.price),
    vat: { id: 66, value: 0 },   // Contribuenti forfettari
    gross_price: parseFloat(item.price),
    discount: item.discount_allocations?.length > 0
      ? Math.round((item.discount_allocations.reduce((s,d) => s + parseFloat(d.amount), 0) / (parseFloat(item.price) * item.quantity)) * 100)
      : 0
  }));

  // 5. Crea fattura
  console.log('\n🧾 Creo fattura su FIC...');
  const totalPrice = parseFloat(order.total_price);
  const needsBollo = totalPrice > 77.47;

  const invoicePayload = {
    data: {
      type: 'invoice',
      date: new Date().toISOString().split('T')[0],
      entity: {
        name: customerName,
        email: order.email || undefined,
        tax_code: cf || undefined,
        address_street: billing.address1 || undefined,
        address_city: billing.city || undefined,
        address_postal_code: billing.zip || undefined,
        address_province: billing.province_code || undefined,
        country: billing.country_code === 'IT' ? 'Italia' : (billing.country || 'Italia'),
        ei_code: '0000000',
      },
      items_list: items,
      payments_list: [
        { amount: totalPrice, due_date: new Date().toISOString().split('T')[0], payment_terms: { days: 0, type: 'standard' } }
      ],
      ...(needsBollo ? { stamp_duty: 2.00 } : {}),
      subject: `Ordine Shopify #${order.order_number}`,
      notes: '',  // riepilogo IVA gestito dal tipo IVA id:66
      e_invoice: true,
      ei_data: {
        payment_method: 'MP08',
        ...(needsBollo ? { stamp_duty_value: 2.00 } : {}),
      },
    }
  };

  const invoiceRes = await httpsPost(
    'api-v2.fattureincloud.it',
    `/c/${FIC_COMPANY}/issued_documents`,
    invoicePayload,
    { 'Authorization': `Bearer ${FIC_TOKEN}` }
  );

  if (invoiceRes.status !== 200 && invoiceRes.status !== 201) {
    console.error('❌ Errore creazione fattura:', invoiceRes.status, JSON.stringify(invoiceRes.body).substring(0, 500));
    process.exit(1);
  }

  const inv = invoiceRes.body.data;
  console.log(`\n✅ Fattura creata!`);
  console.log(`   Numero: ${inv.number}`);
  console.log(`   Data:   ${inv.date}`);
  console.log(`   Totale: €${inv.amount_gross}`);
  console.log(`   URL:    https://secure.fattureincloud.it/issued-documents/${inv.id}/edit\n`);
}

main().catch(e => { console.error('❌ Errore:', e); process.exit(1); });
