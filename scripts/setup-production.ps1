# Script per setup database production su Vercel
Write-Host "🚀 Avvio setup database production..." -ForegroundColor Green

# Sostituisci con la tua CRON_SECRET da Vercel
$CRON_SECRET = "EfOZ7mCQLl/3VJrF2vlGCQ=="

try {
    $headers = @{
        "Authorization" = "Bearer $CRON_SECRET"
    }
    
    Write-Host "📡 Chiamata API setup-db..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "https://newsita.vercel.app/api/setup-db" -Method GET -Headers $headers
    
    Write-Host "✅ Setup completato!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Errore durante setup:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`n🔧 Prova senza autenticazione:" -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://newsita.vercel.app/api/setup-db" -Method GET
}
