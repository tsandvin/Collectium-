$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ShortcutName = "Collectium Canvas Program Pro.lnk"
$Target = Join-Path $ProjectDir "Start-Collectium-Canvas.cmd"
$Desktop = [Environment]::GetFolderPath("Desktop")
$StartMenu = Join-Path ([Environment]::GetFolderPath("Programs")) "Collectium"
New-Item -ItemType Directory -Force -Path $StartMenu | Out-Null
$WshShell = New-Object -ComObject WScript.Shell
foreach ($Folder in @($Desktop, $StartMenu)) {
  $ShortcutPath = Join-Path $Folder $ShortcutName
  $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
  $Shortcut.TargetPath = $Target
  $Shortcut.WorkingDirectory = $ProjectDir
  $Shortcut.Description = "Collectium React Canvas Program Pro"
  $Shortcut.Save()
}
Write-Host "Shortcut created on Desktop and Start Menu."
