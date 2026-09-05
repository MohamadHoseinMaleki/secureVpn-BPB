# secureVpn: download BPB sub, rename configs, save + optional static worker body
# Usage:
#   .\scripts\rewrite-sub.ps1 -SubUrl "https://rcnf9.../sub/raw?app=xray"

param(
  [Parameter(Mandatory = $true)]
  [string]$SubUrl,
  [string]$OutFile = "output\securevpn-sub.txt",
  [string]$ProfileName = "secureVpn"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path (Split-Path $OutFile) | Out-Null

Write-Host "Downloading subscription..."
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "v2rayNG/1.10.23")
$raw = $wc.DownloadString($SubUrl.Trim())

function Decode-Base64Utf8([string]$s) {
  $bytes = [Convert]::FromBase64String(($s -replace "\s", ""))
  return [System.Text.Encoding]::UTF8.GetString($bytes)
}
function Encode-Base64Utf8([string]$s) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($s)
  return [Convert]::ToBase64String($bytes)
}

$wasBase64 = $false
$text = $raw.Trim()
if ($text -match '^(vless|vmess|trojan|ss)://') {
  $lines = $text -split "`r?`n" | Where-Object { $_.Trim() -ne "" }
} else {
  try {
    $decoded = Decode-Base64Utf8 $text
    if ($decoded -match '://') {
      $wasBase64 = $true
      $lines = $decoded -split "`r?`n" | Where-Object { $_.Trim() -ne "" }
    } else {
      $lines = $text -split "`r?`n" | Where-Object { $_.Trim() -ne "" }
    }
  } catch {
    $lines = $text -split "`r?`n" | Where-Object { $_.Trim() -ne "" }
  }
}

function Get-Name($remark, $index, $line) {
  $r = "$remark"
  if ($r -match 'Clean\s*IP') { return "$ProfileName | Clean IP" }
  if ($r -match 'Domain') { return "$ProfileName | Cloudflare" }
  if ($r -match 'IPv6') { return "$ProfileName | IPv6" }
  if ($r -match 'IPv4') { return "$ProfileName | IPv4" }
  if ($r -match 'Best\s*Ping') { return "$ProfileName | Best Ping" }
  if ($r -match 'Upstream') { return "$ProfileName | Upstream" }
  $clean = $r -replace '💦', '' -replace 'BPB\s*Panel', '' -replace 'VLESS', '' -replace 'Trojan', ''
  $clean = $clean -replace '\d+\.', '' -replace '\s+:\s*\d+', '' -replace '\s+', ' '
  $clean = $clean.Trim()
  if ($clean.Length -gt 0 -and $clean.Length -le 40) { return "$ProfileName | $clean" }
  return "$ProfileName | $index"
}

$out = New-Object System.Collections.Generic.List[string]
$i = 0
foreach ($line in $lines) {
  $line = $line.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { continue }
  $i++
  if ($line -match '^(vless|trojan|ss)://' -and $line.Contains("#")) {
    $idx = $line.IndexOf("#")
    $base = $line.Substring(0, $idx)
    $old = [Uri]::UnescapeDataString($line.Substring($idx + 1))
    $name = Get-Name $old $i $line
    $out.Add($base + "#" + [Uri]::EscapeDataString($name))
  }
  elseif ($line -match '^vmess://') {
    try {
      $b64 = $line -replace '^vmess://', ''
      $json = Decode-Base64Utf8 $b64 | ConvertFrom-Json
      $old = [string]$json.ps
      $json.ps = Get-Name $old $i $line
      $newJson = $json | ConvertTo-Json -Compress
      $out.Add("vmess://" + (Encode-Base64Utf8 $newJson))
    } catch {
      $out.Add($line)
    }
  }
  else {
    $out.Add($line)
  }
}

$body = ($out -join "`n")
if ($wasBase64) { $body = Encode-Base64Utf8 $body }

[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\" + $OutFile.Replace("/", "\"), $body)
Write-Host "OK wrote $OutFile ($($out.Count) configs)"
Write-Host "Profile name target: $ProfileName"
Write-Host ""
Write-Host "Next: either import this file in client, or paste into static worker (see docs/LOCAL_REWRITE.md)"
