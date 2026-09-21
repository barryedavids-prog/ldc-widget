# Local preview server. Run:  .\serve.ps1
# Then open http://localhost:8000/staging/  (or /prod/)
# Press Ctrl+C to stop.
#
# Why a server and not just double-clicking index.html? Browsers treat file://
# pages specially, and the page's privacy policy (Content-Security-Policy) may
# not behave the same way. A local server matches how GitHub Pages serves it.
param([int]$Port = 8000)

Set-Location $PSScriptRoot
Write-Host "Preview:  http://localhost:$Port/staging/"
Write-Host "Prod:     http://localhost:$Port/prod/"
Write-Host "Embed test page: http://localhost:$Port/docs/embed-test.html"
Write-Host "Ctrl+C to stop."
python -m http.server $Port --bind 127.0.0.1
