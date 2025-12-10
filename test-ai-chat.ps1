$uri = "https://jagat-acadamey-1.onrender.com/api/ai-chat"
$body = @{
    message = "Hello, test message"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer test-token"
    "Content-Type" = "application/json"
}

Write-Host "Testing endpoint: $uri"
Write-Host "Request body: $body"

try {
    $response = Invoke-WebRequest -Uri $uri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
