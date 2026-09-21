# Promote staging to production. Run:  .\promote.ps1
#
# What it does:
#   1. Checks you are on main and that staging has no uncommitted changes
#      (so prod always matches a version you have actually committed).
#   2. Makes prod/ an exact mirror of staging/.
#   3. Commits the result.
# It does NOT push. Run `git push` yourself when you are happy.

param([switch]$Yes)   # -Yes skips the confirmation question

# git writes harmless warnings to stderr; don't treat those as fatal. We check exit codes instead.
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne 'main') { throw "You are on '$branch'. Switch to main first: git switch main" }

if (git status --porcelain staging) {
    throw "staging/ has uncommitted changes. Commit them first, so prod matches a saved version."
}

$stagingCommit = (git log -1 --format=%h -- staging).Trim()
Write-Host "About to copy staging (last changed in commit $stagingCommit) over prod."
if (-not $Yes) {
    $answer = Read-Host "Continue? (y/n)"
    if ($answer -ne 'y') { Write-Host "Cancelled."; exit 0 }
}

# /MIR mirrors the folder: copies new/changed files AND removes files gone from staging
robocopy staging prod /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed (exit code $LASTEXITCODE)" }

git add prod
if ($LASTEXITCODE -ne 0) { throw 'git add failed' }
if (-not (git status --porcelain prod)) { Write-Host "prod already matches staging. Nothing to do."; exit 0 }

git commit -m "Promote staging ($stagingCommit) to prod"
if ($LASTEXITCODE -ne 0) { throw 'git commit failed' }
Write-Host "Done. Review with 'git show --stat', then publish with 'git push'."

