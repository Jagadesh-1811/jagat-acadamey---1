$uri = "https://jagat-acadamey-1.onrender.com/api/auth/delete"
$headers = @{
    "Authorization" = "Bearer test-token-12345"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri $uri -Method Delete -Headers $headers -UseBasicParsing
    Write-Host "Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response Body: $($_.Exception.Response)"
}
