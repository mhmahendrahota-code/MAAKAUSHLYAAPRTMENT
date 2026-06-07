$BASE_URL = "https://maakaushlyaaprtment.onrender.com"

# Login
$loginBody = [PSCustomObject]@{ email = "admin@maakaushalya.com"; password = "password123" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$TOKEN = $loginResp.token
Write-Host "Token obtained: $($TOKEN.Substring(0,20))..."

$headers = @{ Authorization = "Bearer $TOKEN" }

# Test TC-06 debug
$regObj = [PSCustomObject]@{
    name = "TEST TC06 Debug LeaseSubmitted"
    email = "tc06.rented.leasesub@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"
    gender = "Male"
    flatNo = "G-106"
    phone = "9000000006"
    occupancyStatus = "Rented"
    tenantType = "Family"
    ownerName = "Subhash Chandra"
    ownerPhone = "9000000061"
    familyMembers = 2
    moveInDate = "2024-01-15"
    leaseDuration = "24 months"
    leaseAgreementSubmitted = $true
    aadhaarNumber = "4444 5555 6666"
}
$regBody = $regObj | ConvertTo-Json -Compress
Write-Host "Sending body: $regBody"

try {
    $resp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method POST -ContentType "application/json" -Headers $headers -Body $regBody
    Write-Host "SUCCESS: $($resp | ConvertTo-Json)"
} catch {
    Write-Host "HTTP STATUS: $($_.Exception.Response.StatusCode)"
    Write-Host "ERROR DETAIL: $($_.ErrorDetails.Message)"
    Write-Host "EXCEPTION: $($_.Exception.Message)"
    
    # Try to read response stream
    try {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "BODY: $($reader.ReadToEnd())"
    } catch {}
}
