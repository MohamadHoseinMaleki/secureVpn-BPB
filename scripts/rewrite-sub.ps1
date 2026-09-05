# secureVpn: download BPB sub, rename configs, save file
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\rewrite-sub.ps1 -SubUrl "https://.../sub/raw?app=xray"

param(
  [Parameter(Mandatory = $true)]
  [string]$SubUrl,
  [string]$OutFile = "output\securevpn-sub.txt",
  [string]$ProfileName = "secureVpn"
)

$ErrorActionPreference = "Stop"

$dir = Split-Path -Parent $OutFile
if ($dir -and -not (Test-Path $dir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Downloading subscription..."
try {
  $wc = New-Object System.Net.WebClient
  $wc.Encoding = [System.Text.Encoding]::UTF8
  $wc.Headers.Add("User-Agent", "v2rayNG/1.10.23")
  $raw = $wc.DownloadString($SubUrl.Trim())
} catch {
  Write-Host "Download failed: $_"
  exit 1
}

function Decode-Base64Utf8([string]$s) {
  $clean = ($s -replace "\s", "")
  $bytes = [Convert]::FromBase64String($clean)
  return [System.Text.Encoding]::UTF8.GetString($bytes)
}

function Encode-Base64Utf8([string]$s) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($s)
  return [Convert]::ToBase64String($bytes)
}

$wasBase64 = $false
$text = $raw.Trim()
$lines = @()

if ($text -match '^(vless|vmess|trojan|ss)://') {
  $lines = $text -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
} else {
  try {
    $decoded = Decode-Base64Utf8 $text
    if ($decoded -match '://') {
      $wasBase64 = $true
      $lines = $decoded -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    } else {
      $lines = $text -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    }
  } catch {
    $lines = $text -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
  }
}

function Get-Name([string]$remark, [int]$index, [string]$line) {
  $r = [string]$remark
  if ($r -match 'Clean\s*IP') { return "$ProfileName | Clean IP" }
  if ($r -match 'Domain') { return "$ProfileName | Cloudflare" }
  if ($r -match 'IPv6') { return "$ProfileName | IPv6" }
  if ($r -match 'IPv4') { return "$ProfileName | IPv4" }
  if ($r -match 'Best\s*Ping') { return "$ProfileName | Best Ping" }
  if ($r -match 'Upstream') { return "$ProfileName | Upstream" }

  $clean = $r
  $clean = $clean -replace 'BPB\s*Panel', ''
  $clean = $clean -replace 'BPB', ''
  $clean = $clean -replace 'VLESS', ''
  $clean = $clean -replace 'Trojan', ''
  $clean = $clean -replace '\d+\.', ''
  $clean = $clean -replace '\s*:\s*\d+', ''
  $clean = $clean -replace '[^\x20-\x7E]', ' '
  $clean = $clean -replace '\s+', ' '
  $clean = $clean.Trim()

  if ($clean.Length -gt 0 -and $clean.Length -le 40) {
    return "$ProfileName | $clean"
  }
  return "$ProfileName | $index"
}

$outLines = New-Object System.Collections.Generic.List[string]
$i = 0

foreach ($line in $lines) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  if ($line.StartsWith("#")) { continue }
  $i++

  if (($line -match '^(vless|trojan|ss)://') -and $line.Contains("#")) {
    $idx = $line.IndexOf("#")
    $base = $line.Substring(0, $idx)
    $old = $line.Substring($idx + 1)
    try { $old = [Uri]::UnescapeDataString($old) } catch { }
    $name = Get-Name $old $i $line
    $outLines.Add($base + "#" + [Uri]::EscapeDataString($name))
    continue
  }

  if ($line -match '^vmess://') {
    try {
      $b64 = $line.Substring(8)
      $jsonText = Decode-Base64Utf8 $b64
      $json = $jsonText | ConvertFrom-Json
      $old = [string]$json.ps
      $json.ps = Get-Name $old $i $line
      $newJson = $json | ConvertTo-Json -Compress
      $outLines.Add("vmess://" + (Encode-Base64Utf8 $newJson))
    } catch {
      $outLines.Add($line)
    }
    continue
  }

  $outLines.Add($line)
}

$body = ($outLines -join "`n")
if ($wasBase64) {
  $body = Encode-Base64Utf8 $body
}

$fullPath = Join-Path (Get-Location) $OutFile
[System.IO.File]::WriteAllText($fullPath, $body, [System.Text.UTF8Encoding]::new($false))

Write-Host "OK wrote $fullPath"
Write-Host "Configs: $($outLines.Count)"
Write-Host "Profile: $ProfileName"
