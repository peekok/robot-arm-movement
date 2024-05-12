# Check if the current shell
if ($env:CMDER_ROOT -eq "") {
    $shell = "cmd"
} else {
    $shell = "powershell"
}

# Install npm dependencies for client and server
Write-Host "Installing npm dependencies..."
Start-Process -FilePath "yarn" -ArgumentList "--prefix", "client" -Wait
Start-Process -FilePath "yarn" -ArgumentList "--prefix", "server" -Wait

# Run client and server applications in separate terminals
Start-Process -FilePath $shell -ArgumentList "/k yarn --prefix client start"
Start-Process -FilePath $shell -ArgumentList "/k yarn --prefix server start"
