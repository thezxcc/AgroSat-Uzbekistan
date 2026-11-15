$ErrorActionPreference = 'Stop'
$inputPath = 'D:\AgroSat\artifacts\AgroSat_NASA_2026_7slides.pptx'
$outDir = 'D:\AgroSat\artifacts\slides-review'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$app=New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$p=$app.Presentations.Open($inputPath,0,0,-1)
try {
  Write-Output ('PPTX_SLIDES='+$p.Slides.Count)
  for($i=1;$i -le $p.Slides.Count;$i++) {
    $file=Join-Path $outDir ('slide'+$i+'.png')
    $p.Slides.Item($i).Export($file,'PNG',1440,810)
    Write-Output ('RENDERED='+$file)
  }
} finally { $p.Close(); $app.Quit() }
