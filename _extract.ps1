$c = Get-Content 'c:\Users\admin\Desktop\X402\法律文书生成器.html' -Raw -Encoding UTF8
$ss = $c.IndexOf('const formConfigs = {')
$se = $c.IndexOf('</script>', $ss)
$js = $c.Substring($ss, $se - $ss)
$fcStart = $js.IndexOf("const formConfigs = {")
$compStart = $js.IndexOf("// ==================== COMPOSE GUIDED DATA")
$previewStart = $js.IndexOf("// ==================== PREVIEW ====================")
$activationStart = $js.IndexOf("// ==================== ACTIVATION ====================")
$searchArea = $js.Substring($fcStart, $compStart - $fcStart)
$fcEnd = $searchArea.LastIndexOf("}}}") + 3
$formConfigs = $js.Substring($fcStart, $fcEnd)

$docMap = @{}
$docMap["divorce"] = "lihunxieyishu"
$docMap["iou"] = "jietiao"
$docMap["rental"] = "zufanghetong"
$docMap["labor"] = "laodongzhongcai"
$docMap["complaint"] = "minshiqisuzhuang"
$docMap["employment"] = "laodonghetong"
$docMap["transfer"] = "zhuanranghetong"
$docMap["bail"] = "qubaohoushen"
$docMap["debt"] = "qiantiao"
$docMap["partner"] = "hezuoxieyi"
$docMap["prenup"] = "hunqiancaichan"
$docMap["accident"] = "jiaotongshigu"

$entries = @{}
foreach ($key in $docMap.Keys) {
  $pattern = "`n  " + $key + ": {"
  $pos = $formConfigs.IndexOf($pattern)
  if ($pos -lt 0) { $pattern = "`n  " + $key + ":  {"; $pos = $formConfigs.IndexOf($pattern) }
  if ($pos -lt 0) { Write-Host "NOT FOUND: $key"; continue }
  $entries[$key] = @{ start = $pos }
}
Write-Host "Found $($entries.Count) config entries"
$sorted = $entries.Keys | Sort-Object { $entries[$_].start }
for ($i = 0; $i -lt $sorted.Count; $i++) {
  $key = $sorted[$i]
  $start = $entries[$key].start
  if ($i -lt $sorted.Count - 1) { $end = $entries[$sorted[$i + 1]].start - 2 }
  else { $end = $formConfigs.Length }
  $text = $formConfigs.Substring($start, $end - $start).Trim()
  if ($text.EndsWith(",")) { $text = $text.Substring(0, $text.Length - 1) }
  $text | Out-File -Encoding utf8 "c:\Users\admin\Desktop\lawtools\_cfg_$key.txt"
  Write-Host "$key -> _cfg_$key.txt ($($text.Length) chars)"
}
Write-Host "Done"