# Fix Production Database - Guida Rapida

## 🔍 Problema Identificato
Il sito su Vercel funziona ma non mostra articoli perché il database Neon di production è vuoto.

## 🚀 Soluzione Immediata

### 1. Verifica Environment Variables Vercel
Vai su [Vercel Dashboard](https://vercel.com/dashboard) → Project → Settings → Environment Variables e verifica:

```
✅ DATABASE_URL=postgresql://[tuo-username]:[tua-password]@[host].neon.tech/newsita?sslmode=require
✅ CRON_SECRET=[tua-secret-key]
✅ NEWSAPI_KEY=[tua-api-key] (opzionale)
✅ GNEWS_API_KEY=[tua-api-key] (opzionale)
✅ OPENAI_API_KEY=[tua-api-key] (opzionale)
```

### 2. Setup Database Production
Esegui questo comando per popolare il database:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://[tuo-sito].vercel.app/api/setup-db
```

### 3. Fetch Articoli (Opzionale)
Per popolare con articoli reali:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://[tuo-sito].vercel.app/api/news?refresh=true"
```

## 🛠️ API Routes Create

### `/api/setup-db` - Setup Database
- Crea tabelle e indici se non esistono
- Inserisce 3 articoli di esempio
- Protetto da CRON_SECRET

### `/api/news?refresh=true` - Fetch Articoli
- Scarica articoli reali dalle fonti
- Li salva nel database
- Protetto da rate limiting

## 📋 Checklist Deploy

- [ ] DATABASE_URL configurato su Vercel
- [ ] CRON_SECRET impostato
- [ ] API keys configurate (se usate)
- [ ] Database setup eseguito
- [ ] Articoli fetchati (opzionale)
- [ ] Sito mostra contenuti

## 🔧 Troubleshooting

### Database vuoto dopo setup:
```bash
# Verifica connessione
curl https://[tuo-sito].vercel.app/api/news

# Se restituisce array vuoto, rifai setup
curl -H "Authorization: Bearer $CRON_SECRET" https://[tuo-sito].vercel.app/api/setup-db
```

### Errori di connessione:
1. Controlla DATABASE_URL su Vercel
2. Verifica stato database Neon
3. Prova con connection string diretta

### Cron job non funziona:
1. Verifica CRON_SECRET su Vercel
2. Controlla logs Vercel
3. Testa manualmente l'endpoint

## 📊 Monitoraggio

Dopo il setup, il sito dovrebbe:
- Mostrare almeno 3 articoli di esempio
- Poter fetchare articoli reali automaticamente
- Eseguire cron job giornaliero

---

**Nota**: Esegui questi passaggi nell'ordine indicato per garantire che il production database sia configurato correttamente.
