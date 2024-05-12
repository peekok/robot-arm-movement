# Define function to handle cleanup
function Cleanup {
    # Stop the client and server applications if running
    Stop-Process -Name "node" -ErrorAction SilentlyContinue
    Stop-Process -Name "react-scripts" -ErrorAction SilentlyContinue
    exit 1
}

# Set up trap to catch interruptions
trap { Cleanup; exit }

# Define paths to client and server directories
$clientDir = "client"
$serverDir = "server"

# Check if client and server directories exist
if (-not (Test-Path $clientDir)) {
    Write-Host "Client directory not found. Exiting..."
    exit 1
}

if (-not (Test-Path $serverDir)) {
    Write-Host "Server directory not found. Exiting..."
    exit 1
}

if (-not (Test-Path $clientDir\node_modules)) {
    Write-Host "Client dependencies not found. Installing..."
    # Install npm dependencies for client
    Write-Host "Installing dependencies for client..."
    Start-Process -FilePath "npm" -ArgumentList "install --legacy-peer-deps" -WorkingDirectory $clientDir -Wait
} else {
    Write-Host "Client dependencies found. Skipping installation..."
}

if (-not (Test-Path $serverDir\node_modules)) {
    Write-Host "Server dependencies not found. Installing..."
    # Install npm dependencies for server
    Write-Host "Installing dependencies for server..."
    Start-Process -FilePath "npm" -ArgumentList "install" -WorkingDirectory $serverDir -Wait
} else {
    Write-Host "Server dependencies found. Skipping installation..."
}

# Start client application
Write-Host "Starting client application..."
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory $clientDir

# Start server application
Write-Host "Starting server application..."
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory $serverDir

# Wait for user input to exit
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Clean up resources
Cleanup
