# Build exactly seven English slides in Microsoft PowerPoint, no fake science.
# Requirements: local Office 365 PowerPoint, original AgroSat source/screenshots.
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
$artifact=Join-Path $root 'artifacts'
$destination=Join-Path $artifact 'AgroSat_NASA_2026_7slides.pptx'
$pdfOutput=Join-Path $artifact 'AgroSat_NASA_2026_7slides.pdf'
$metric2025=Invoke-RestMethod 'http://127.0.0.1:8000/api/climate/2025' -TimeoutSec 12
$monthly2025=Invoke-RestMethod 'http://127.0.0.1:8000/api/climate/2025/monthly' -TimeoutSec 12
if ([math]::Abs($metric2025.total_precipitation_mm - 94.47) -gt 0.005 -or
    $metric2025.hot_days_40c -ne 21 -or $monthly2025.months.Count -ne 12) {
 throw 'NASA values changed: review all slide figures before rebuilding.'
}
function Ole([string]$rgb) {
 $r=[Convert]::ToInt32($rgb.Substring(0,2),16)
 $g=[Convert]::ToInt32($rgb.Substring(2,2),16)
 $b=[Convert]::ToInt32($rgb.Substring(4,2),16)
 return [int]($r+($g*256)+($b*65536))
}
$ppt=New-Object -ComObject PowerPoint.Application
$ppt.Visible=-1
$p=$ppt.Presentations.Add()
$p.PageSetup.SlideWidth=960
$p.PageSetup.SlideHeight=540
function Rect($slide,$x,$y,$w,$h,$color,$rounded=$false) {
 $id=if($rounded){5}else{1}
 $v=$slide.Shapes.AddShape($id,$x,$y,$w,$h)
 $v.Fill.ForeColor.RGB=(Ole $color)
 $v.Line.Visible=0
}
function T($slide,$value,$x,$y,$w,$h,$size,$color,$bold=$false) {
 $v=$slide.Shapes.AddTextbox(1,$x,$y,$w,$h)
 $v.TextFrame.TextRange.Text=$value
 $v.TextFrame.TextRange.Font.Name='Aptos'
 $v.TextFrame.TextRange.Font.Size=$size
 $v.TextFrame.TextRange.Font.Bold=if($bold){-1}else{0}
 $v.TextFrame.TextRange.Font.Color.RGB=(Ole $color)
 $v.TextFrame.WordWrap=-1
}
function Photo($s,$path,$x,$y,$w,$h) {
 if(Test-Path $path){$null=$s.Shapes.AddPicture($path,0,-1,$x,$y,$w,$h)}
}
function Slide($index,$overline,$title,$dark=$false) {
 $s=$p.Slides.Add($p.Slides.Count+1,12)
 $bg=if($dark){'082A30'}else{'F5F7F0'}
 $fg=if($dark){'F3FFF8'}else{'163D36'}
 Rect $s 0 0 960 540 $bg
 Rect $s 39 32 7 19 '4CC79B'
 T $s $overline 58 26 815 24 13 $(if($dark){'A9E3CB'}else{'237C62'}) $true
 T $s $title 50 67 854 72 34 $fg $true
 Rect $s 50 493 860 1 $(if($dark){'315252'}else{'D3E5D7'})
 T $s 'AgroSat Uzbekistan  |  NASA Space Apps 2026  |  Field Shift' 53 498 730 25 9 $(if($dark){'A9CEC1'}else{'698477'})
 T $s ("$index / 7") 851 499 70 23 10 $(if($dark){'A9CEC1'}else{'698477'}) $true
 return $s
}
function Card($s,$x,$y,$w,$h,$dark=$false) {
 Rect $s $x $y $w $h $(if($dark){'143B40'}else{'FFFFFF'}) $true
}
function SmallTag($s,$value,$x,$y,$w) {
 Rect $s $x $y $w 26 'DDF3E6' $true
 T $s $value ($x+8) ($y+2) ($w-16) 22 11 '1A7254' $true
}

$s=Slide 1 'EARTH INTELLIGENCE FOR FARMERS' 'AgroSat Uzbekistan' $true
T $s 'Explainable crop-rotation exploration for irrigated farms in Khorezm' 53 158 450 125 23 'D7FAE9'
T $s 'NASA GPM/IMERG + POWER' 53 305 450 30 17 '78E7B5' $true
T $s 'ICARDA research + FAO references' 53 346 450 30 17 '78E7B5' $true
T $s 'Local decision support — not a yield prediction' 53 409 455 42 14 'BAD7CF'
Photo $s (Join-Path $artifact 'jury-light-firstscreen.png') 535 165 370 266

$s=Slide 2 'KHOREZM, LOWER AMU DARYA' 'A field decision is not only a weather decision'
Card $s 50 160 470 278
T $s 'The local challenge' 72 184 414 40 23 '163D36' $true
T $s '• Crop decisions depend on canal irrigation timing.' 73 233 426 50 17 '49685E'
T $s '• Soil salinity and drainage differ by field.' 73 291 420 50 17 '49685E'
T $s '• Short post-wheat windows complicate crop choice.' 73 348 420 52 17 '49685E'
Rect $s 540 160 370 278 '113A37' $true
Photo $s (Join-Path $root 'frontend\public\imagery\modis_2025_july.png') 546 169 358 219
T $s 'NASA GIBS / MODIS · July 2025' 557 396 340 27 12 'DEFAEB' $true
T $s 'Image only — no field-level numeric NDVI.' 53 457 850 25 11 '49685E'

$s=Slide 3 'NASA OBSERVATIONS' '26 years of reproducible climate records'
$numbers=@(@('9,497','daily records'),@('94.47 mm','2025 IMERG-derived rain'),@('21 days','2025 Tmax ≥ 40°C'))
for($i=0;$i -lt 3;$i++){
 $x=52+$i*294
 Card $s $x 155 278 89
 T $s $numbers[$i][0] ($x+13) 165 250 37 24 '163D36' $true
 T $s $numbers[$i][1] ($x+13) 207 251 24 12 '49685E'
}
T $s 'Monthly precipitation in 2025  |  NASA POWER / IMERG  |  mm' 55 273 842 29 16 '163D36' $true
$rain=@(0.71,4.97,29.97,12.74,7.37,17.79,0.9,0.25,3.44,4.41,1.21,10.71)
for($i=0;$i -lt 12;$i++) {
 if ([math]::Abs([double]$monthly2025.months[$i].precipitation_mm-[double]$rain[$i]) -gt 0.005) {
  throw "NASA monthly rainfall changed at index $i; regenerate slide data before presentation."
 }
}
for($i=0;$i -lt 12;$i++){
 $x=58+$i*71
 $h=[Math]::Max(3,($rain[$i]/30)*124)
 Rect $s $x (437-$h) 33 $h '44B98B' $true
 T $s ([string]($i+1)) ($x+8) 441 35 19 11 '49685E' $true
}
T $s 'NASA grid point 41.55°N, 60.62°E; not canal irrigation or a forecast.' 53 472 850 19 11 '49685E'

$s=Slide 4 'EXPLAINABLE PROCESS' 'How AgroSat supports a decision'
$steps=@(
 @('1','NASA climate','Daily rainfall, heat and frost'),
 @('2','Farmer context','Water, dates, soil and equipment'),
 @('3','Research context','ICARDA/FAO crop evidence'),
 @('4','Compare A/B/C','Six factors, risks and unknowns')
)
for($i=0;$i -lt 4;$i++) {
 $x=50+$i*219
 Card $s $x 174 201 199
 Rect $s ($x+16) 193 38 38 '237C62' $true
 T $s $steps[$i][0] ($x+26) 197 22 29 21 'FFFFFF' $true
 T $s $steps[$i][1] ($x+15) 255 180 37 18 '163D36' $true
 T $s $steps[$i][2] ($x+15) 302 175 62 14 '49685E'
}
T $s 'New: checks crop-stage order and records measurement provenance.' 50 413 850 33 17 '237C62' $true
T $s 'Chronological order is NOT proof of crop suitability or guaranteed yield.' 50 450 850 26 13 '49685E'

$s=Slide 5 'RESEARCH OPTIONS' 'Three rotations — no artificial ranking'
$rot=@(
 @('A','Wheat → fallow → cotton','Reference example','No additional summer harvest; soil impact unknown'),
 @('B','Wheat → mung bean → cotton','Possible second harvest','Needs irrigation, season and cultivar validation'),
 @('C','Wheat → mung → winter pea → cotton','Potential added cover','Separate winter stage and field operations')
)
for($i=0;$i -lt 3;$i++){
 $x=50+$i*295
 Card $s $x 160 280 274
 SmallTag $s $rot[$i][0] ($x+15) 180 36
 T $s $rot[$i][1] ($x+15) 220 250 74 18 '163D36' $true
 T $s $rot[$i][2] ($x+15) 301 250 31 15 '237C62' $true
 T $s $rot[$i][3] ($x+15) 344 245 75 14 '49685E'
}
T $s 'When summer irrigation is unavailable, options B and C carry high water risk.' 50 453 852 31 14 'AD653C' $true

$s=Slide 6 'WORKING PROTOTYPE' 'Readable dashboard — two coherent themes'
Card $s 48 159 418 278
Rect $s 491 159 418 278 '143B40' $true
Photo $s (Join-Path $artifact 'jury-light-firstscreen.png') 54 171 405 226
Photo $s (Join-Path $artifact 'agrosat-dark-viewport.png') 497 171 405 226
T $s 'Milk / sage LIGHT' 61 410 340 28 14 '163D36' $true
T $s 'Deep navy / green DARK' 504 410 355 28 14 'F3FFF8' $true
T $s 'EN / RU / UZ  •  Responsive layouts  •  Real NASA data  •  Evidence traceability' 51 456 860 25 13 '49685E'

$s=Slide 7 'SCIENTIFIC RESPONSIBILITY' 'Useful decisions begin with clear limitations' $true
$points=@(
 'NASA data describe regional climate, not water delivered to a field.',
 'No farm ECe, NDVI, yield, price or water savings are fabricated.',
 'Calendar checks detect overlap; they are not agronomic forecasts.',
 'Next: local field validation, real measurements and public deployment.'
)
for($i=0;$i -lt 4;$i++){
 Rect $s 57 (158+$i*59) 9 9 '50D6A3' $true
 T $s $points[$i] 81 (143+$i*59) 813 48 17 'E6FCF0'
}
T $s 'Credits: NASA POWER / GPM IMERG / GIBS MODIS; ICARDA 2022 & 2023; FAO EcoCrop and FAO crop water manuals.' 54 422 840 45 11 'B5D8C9'
$p.SaveAs($destination,24) # Office ppSaveAsOpenXMLPresentation
$p.SaveAs($pdfOutput,32) # ppSaveAsPDF (portable view)
$count=$p.Slides.Count
$p.Close()
$ppt.Quit()
Write-Output ('SLIDE_DECK='+$destination)
Write-Output ('SLIDE_COUNT='+$count)
Write-Output ('PDF='+$pdfOutput)
if($count -ne 7) {throw 'Expected exactly 7 slides'}
