# ============================================================
# Generates realistic AI photos for all image slots using the
# free Pollinations.ai API (Flux model, no account needed).
#
# Run from the site root:   powershell tools\generate-photos.ps1
#
# Photos are saved to images/photos/. When done, point the
# `images` paths in js/config.js at them, e.g.:
#     hero: "images/photos/hero.jpg",
#
# If a request fails with HTTP 530, the free service is
# temporarily down — just run the script again later.
# Change $seed for a different variation of every photo.
# ============================================================

$seed = 11
$prompts = [ordered]@{
  "hero.jpg"    = "professional pest control technician in clean teal uniform and cap with backpack sprayer smiling at camera in bright modern living room, commercial marketing photography, natural light, high quality"
  "general.jpg" = "pest control technician in teal uniform applying gel treatment under kitchen cabinets in bright modern kitchen, professional service photography"
  "termite.jpg" = "pest control technician injecting termite treatment into drilled holes along wall skirting inside a home, professional equipment, commercial photography"
  "bedbug.jpg"  = "pest control technician in uniform inspecting mattress seams with flashlight in bright bedroom, professional service photography"
  "rodent.jpg"  = "pest control technician placing tamper-resistant rodent bait station along interior wall, professional service photography"
  "about.jpg"   = "team of three friendly pest control technicians in matching teal uniforms standing with equipment in front of service van, commercial marketing photography"
}

$dir = Join-Path $PSScriptRoot "..\images\photos"
New-Item -ItemType Directory -Force $dir | Out-Null

foreach ($name in $prompts.Keys) {
  $p = [uri]::EscapeDataString($prompts[$name])
  $url = "https://image.pollinations.ai/prompt/$p`?width=1200&height=800&model=flux&nologo=true&seed=$seed"
  Write-Host "Generating $name ..." -NoNewline
  try {
    Invoke-WebRequest -Uri $url -OutFile (Join-Path $dir $name) -TimeoutSec 300
    Write-Host " done"
  } catch {
    Write-Host " FAILED ($($_.Exception.Message))"
  }
}
Write-Host "`nPhotos are in images/photos/. Review them, then update the 'images' paths in js/config.js."
