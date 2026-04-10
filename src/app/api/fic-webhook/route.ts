import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const FIC_TOKEN   = process.env.FIC_ACCESS_TOKEN!;
const FIC_COMPANY = process.env.FIC_COMPANY_ID || '1581421';
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';
const SHOPIFY_ADMIN_TOKEN    = process.env.SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_TOKEN || '';
const SHOPIFY_STORE          = 'grperform.myshopify.com';
const SHOPIFY_API            = '2024-01';

// ─── Helpers ──────────────────────────────────────────────────────────────
async function ficRequest(method: string, path: string, payload?: object): Promise<{ status: number; body: any }> {
  const url = `https://api-v2.fattureincloud.it${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${FIC_TOKEN}`,
      'Accept': 'application/json',
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  let body: any;
  try { body = await res.json(); } catch { body = await res.text(); }
  return { status: res.status, body };
}

async function shopifyRequest(path: string): Promise<{ status: number; body: any }> {
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API}${path}`, {
    headers: { 'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN, 'Accept': 'application/json' },
  });
  let body: any;
  try { body = await res.json(); } catch { body = await res.text(); }
  return { status: res.status, body };
}

// ─── Verifica firma HMAC Shopify ──────────────────────────────────────────
function verifyShopifyWebhook(rawBody: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) return true; // skip in dev
  const hash = crypto.createHmac('sha256', SHOPIFY_WEBHOOK_SECRET).update(rawBody, 'utf8').digest('base64');
  return hash === hmacHeader;
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hmac = req.headers.get('x-shopify-hmac-sha256') || '';

  if (!verifyShopifyWebhook(rawBody, hmac)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let order: any;
  try { order = JSON.parse(rawBody); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const topic = req.headers.get('x-shopify-topic');
  if (topic !== 'orders/paid') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    // 1. Estrai dati cliente
    const billing = order.billing_address || order.shipping_address || {};
    const firstName = billing.first_name || order.customer?.first_name || '';
    const lastName  = billing.last_name  || order.customer?.last_name  || '';
    const email = order.email || order.contact_email || order.customer?.email || '';

    // Fallback finale: credit_card_name dalle transazioni Shopify (nome sulla carta)
    // Necessario per ordini digitali guest dove Shopify non raccoglie nome/email
    let cardName = order.payment_details?.credit_card_name || '';
    if (!firstName && !lastName && !cardName && order.id) {
      const txRes = await shopifyRequest(`/orders/${order.id}/transactions.json?fields=payment_details`);
      if (txRes.status === 200 && txRes.body.transactions?.length > 0) {
        cardName = txRes.body.transactions[0]?.payment_details?.credit_card_name || '';
      }
    }

    const customerName = (
      billing.company ||
      `${firstName} ${lastName}`.trim() ||
      cardName ||
      email ||
      'Cliente'
    ).trim();

    const cf = (order.note_attributes || []).find((a: any) => a.name === 'Codice Fiscale')?.value || '';

    console.log(`[FIC] Ordine #${order.order_number} — ${customerName} — CF: ${cf || 'N/A'}`);

    // 2. Cerca o crea cliente su FIC
    let clientId: number | null = null;
    if (email) {
      const search = await ficRequest('GET', `/c/${FIC_COMPANY}/entities/clients?q=${encodeURIComponent(email)}&fields=id,name,email`);
      if (search.status === 200 && search.body.data?.length > 0) {
        clientId = search.body.data[0].id;
      }
    }

    // If client found, fetch full profile for address data
    let ficClient: any = null;
    if (clientId) {
      const clientDetail = await ficRequest('GET', `/c/${FIC_COMPANY}/entities/clients/${clientId}`);
      if (clientDetail.status === 200 && clientDetail.body.data) {
        ficClient = clientDetail.body.data;
        // Aggiorna SEMPRE il client se abbiamo dati mancanti (CF, nome, indirizzo)
        // Questo garantisce che il tax_code finisca in CodiceFiscale e non in note ausiliarie
        const needsUpdate =
          (cf && ficClient.tax_code !== cf) ||
          (!ficClient.address_street && billing.address1) ||
          (!ficClient.address_city   && billing.city);
        if (needsUpdate) {
          const updatePayload: any = {};
          if (cf) updatePayload.tax_code = cf;
          if (!ficClient.address_street && billing.address1) updatePayload.address_street = billing.address1;
          if (!ficClient.address_city   && billing.city)     updatePayload.address_city   = billing.city;
          if (!ficClient.address_postal_code && billing.zip) updatePayload.address_postal_code = billing.zip;
          if (!ficClient.address_province && billing.province_code) updatePayload.address_province = billing.province_code;
          await ficRequest('PUT', `/c/${FIC_COMPANY}/entities/clients/${clientId}`, {
            data: updatePayload
          });
          ficClient = { ...ficClient, ...updatePayload };
        }
      }
    }

    if (!clientId) {
      // Usa il nome reale: se billing_address non ha first/last name, usa order.customer
      const createName = customerName && customerName !== 'Cliente'
        ? customerName
        : `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || email || 'Cliente Shopify';
      const newClient = await ficRequest('POST', `/c/${FIC_COMPANY}/entities/clients`, {
        data: {
          name: createName,
          email: email || undefined,
          tax_code: cf || undefined,
          address_street: billing.address1 || undefined,
          address_city: billing.city || undefined,
          address_postal_code: billing.zip || undefined,
          address_province: billing.province_code || undefined,
          address_country: billing.country_code || 'IT',
        }
      });
      if (newClient.status !== 200 && newClient.status !== 201) {
        throw new Error(`Errore creazione cliente FIC: ${JSON.stringify(newClient.body).substring(0, 200)}`);
      }
      clientId = newClient.body.data.id;
    }

    // 3. Righe fattura (regime forfettario: VAT id 6, 0%)
    const totalPrice = parseFloat(order.total_price);
    const items = (order.line_items || []).map((item: any) => ({
      name: item.name,
      description: item.variant_title || undefined,
      qty: item.quantity,
      measure: 'pz',
      net_price: parseFloat(item.price),
      vat: { id: 66, value: 0 },
      gross_price: parseFloat(item.price),
    }));

    // 4. Bollo €2 obbligatorio per fatture forfettarie > €77.47
    const needsBollo = totalPrice > 77.47;

    // Build entity from FIC client profile (complete data) or from Shopify order
    const entityData = ficClient ? {
      id: clientId,
      name: ficClient.name,
      email: ficClient.email || email || undefined,
      tax_code: ficClient.tax_code || cf || undefined,
      address_street: ficClient.address_street || billing.address1 || undefined,
      address_city: ficClient.address_city || billing.city || undefined,
      address_postal_code: ficClient.address_postal_code || billing.zip || undefined,
      address_province: ficClient.address_province || billing.province_code || undefined,
      country: 'Italia',
      ei_code: '0000000',
    } : {
      name: customerName,
      email: email || undefined,
      tax_code: cf || undefined,
      address_street: billing.address1 || undefined,
      address_city: billing.city || undefined,
      address_postal_code: billing.zip || undefined,
      address_province: billing.province_code || undefined,
      country: billing.country_code === 'IT' ? 'Italia' : (billing.country || 'Italia'),
      ei_code: '0000000',
    };

    // 5. Crea fattura
    const today = new Date().toISOString().split('T')[0];
    const invoice = await ficRequest('POST', `/c/${FIC_COMPANY}/issued_documents`, {
      data: {
        type: 'invoice',
        date: today,
        entity: entityData,
        items_list: items,
        payments_list: [
          { amount: totalPrice, due_date: today, paid_date: today, status: 'paid', payment_account: { id: 1523745, name: 'SUMUP' }, payment_terms: { days: 0, type: 'standard' } }
        ],
        ...(needsBollo ? { stamp_duty: 2.00 } : {}),
        subject: `Ordine Shopify #${order.order_number}`,
        notes: '',
        e_invoice: true,
        ei_data: {
          payment_method: 'MP08',
          ...(needsBollo ? { stamp_duty_value: 2.00 } : {}),
        },
      }
    });

    if (invoice.status !== 200 && invoice.status !== 201) {
      throw new Error(`Errore creazione fattura FIC: ${JSON.stringify(invoice.body).substring(0, 300)}`);
    }

    const inv = invoice.body.data;
    console.log(`[FIC] ✅ Fattura #${inv.number} creata — ID: ${inv.id} — €${inv.amount_gross}`);

    // 6. Invio automatico fattura elettronica all'SDI
    const sendRes = await ficRequest('POST', `/c/${FIC_COMPANY}/issued_documents/${inv.id}/e_invoice/send`, {});
    if (sendRes.status === 200 || sendRes.status === 201) {
      console.log(`[FIC] 📤 Fattura #${inv.number} inviata all'SDI`);
    } else {
      console.warn(`[FIC] ⚠️ Fattura creata ma invio SDI fallito:`, JSON.stringify(sendRes.body).substring(0, 200));
    }

    return NextResponse.json({ ok: true, invoice_id: inv.id, invoice_number: inv.number, sdi_sent: sendRes.status === 200 || sendRes.status === 201 });

  } catch (err: any) {
    console.error('[FIC] ❌', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
