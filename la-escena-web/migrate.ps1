# Carga .env.local e inyecta las variables antes de correr prisma db push
$envFile = Join-Path $PSScriptRoot ".env.local"

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith('#') -and $line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        # Quitar comillas envolventes si las hay
        if ($val -match '^"(.*)"$' -or $val -match "^'(.*)'$") {
            $val = $matches[1]
        }
        Set-Item -Path "Env:$key" -Value $val
    }
}

Write-Host "Variables cargadas desde .env.local" -ForegroundColor Cyan

# Puerto 5432 bloqueado en esta red — forzar DIRECT_URL al pooler (6543)
$env:DIRECT_URL = $env:DATABASE_URL
Write-Host "DIRECT_URL → pooler (puerto 6543)" -ForegroundColor Yellow

npx prisma db push
