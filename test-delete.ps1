$uri = "https://jagat-acadamey-1.onrender.com/api/auth/delete"
$headers = @{
    "Authorization" = "Bearer dummytoken"
}

try {
    $response = Invoke-WebRequest -Uri $uri -Method Delete -Headers $headers -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
}
