$BASE_URL = "https://maakaushlyaaprtment.onrender.com"
$TOKEN = ""
$success = 0
$skipped = 0
$failed = 0

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   LIVE TEST DATA SEEDER - Part 2" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Admin Login
try {
    $loginBody = [PSCustomObject]@{ email = "admin@maakaushalya.com"; password = "password123" } | ConvertTo-Json
    $loginResp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $TOKEN = $loginResp.token
    Write-Host "Login: OK" -ForegroundColor Green
} catch {
    Write-Host "Login FAILED: $_" -ForegroundColor Red
    exit 1
}

$headers = @{ Authorization = "Bearer $TOKEN" }

function Do-TC {
    param([string]$TC, [bool]$Approve, [object]$Data)
    $body = $Data | ConvertTo-Json -Depth 5 -Compress
    try {
        $resp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method POST -ContentType "application/json" -Headers $headers -Body $body
        $uid = $resp.data.id
        $ast = "Pending"
        if ($Approve -and $uid) {
            try {
                $ar = Invoke-RestMethod -Uri "$BASE_URL/api/users/approve/$uid" -Method PUT -Headers $headers -ContentType "application/json"
                if ($ar.success) { $ast = "Approved" }
            } catch { $ast = "Approve-Err" }
        }
        Write-Host "OK $TC | ID:$uid | $ast" -ForegroundColor Green
        $script:success++
    } catch {
        $em = $_.ErrorDetails.Message
        if ($em -match "already exists" -or $em -match "already") {
            Write-Host "SKIP $TC (exists)" -ForegroundColor Yellow
            $script:skipped++
        } else {
            Write-Host "FAIL $TC : $em" -ForegroundColor Red
            $script:failed++
        }
    }
}

# TC-06 Rented Family - Lease Submitted
Do-TC "TC-06" $true ([PSCustomObject]@{
    name = "TEST TC06 DeepakTiwari LeaseSubmitted"
    email = "tc06.rented.leasesub@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Male"
    flatNo = "G-106"; phone = "9000000006"
    occupancyStatus = "Rented"; tenantType = "Family"
    ownerName = "Subhash Chandra Owner"; ownerPhone = "9000000061"
    familyMembers = 2
    moveInDate = "2024-01-15"; leaseDuration = "24 months"
    leaseAgreementSubmitted = $true
    aadhaarNumber = "4444 5555 6666"
    emergencyContactName = "Ramesh Tiwari"; emergencyContactPhone = "9000000063"
})

# TC-07 Bachelor Verified
Do-TC "TC-07" $true ([PSCustomObject]@{
    name = "TEST TC07 AmitKumar BachelorVerified"
    email = "tc07.bachelor.verified@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Male"
    flatNo = "G-107"; phone = "9000000007"
    occupancyStatus = "Rented"; tenantType = "Bachelor"
    ownerName = "Raj Kishore Owner"; ownerPhone = "9000000071"
    familyMembers = 2
    moveInDate = "2024-03-01"; leaseDuration = "11 months"
    leaseAgreementSubmitted = $true
    aadhaarNumber = "7777 8888 9999"
    isLegacyBachelor = $false
})

# TC-08 Bachelor Pending
Do-TC "TC-08" $true ([PSCustomObject]@{
    name = "TEST TC08 RajeshPatel BachelorPending"
    email = "tc08.bachelor.pending@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Male"
    flatNo = "G-108"; phone = "9000000008"
    occupancyStatus = "Rented"; tenantType = "Bachelor"
    ownerName = "Shyam Sundar Owner"; ownerPhone = "9000000081"
    familyMembers = 3
    moveInDate = "2025-12-01"; leaseDuration = "11 months"
    leaseAgreementSubmitted = $false
    isLegacyBachelor = $false
})

# TC-09 Legacy Bachelor
Do-TC "TC-09" $true ([PSCustomObject]@{
    name = "TEST TC09 KareemKhan LegacyBachelor"
    email = "tc09.bachelor.legacy@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Male"
    flatNo = "G-109"; phone = "9000000009"
    occupancyStatus = "Rented"; tenantType = "Bachelor"
    ownerName = "Ahmad Khan Owner"; ownerPhone = "9000000091"
    familyMembers = 2
    moveInDate = "2018-05-01"; leaseDuration = "11 months"
    leaseAgreementSubmitted = $true
    aadhaarNumber = "2222 3333 4444"
    isLegacyBachelor = $true
    exemptionRef = "RWA-2018-LEG-U001 AGM-Apr-2018"
})

# TC-10 Lease Expiring Soon
Do-TC "TC-10" $true ([PSCustomObject]@{
    name = "TEST TC10 RahulSoni LeaseExpiring"
    email = "tc10.rented.expiring@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Male"
    flatNo = "G-110"; phone = "9000000010"
    occupancyStatus = "Rented"; tenantType = "Family"
    ownerName = "Mahesh Soni Owner"; ownerPhone = "9000000101"
    familyMembers = 1
    moveInDate = "2025-07-01"; leaseDuration = "11 months"
    leaseAgreementSubmitted = $true
})

# TC-11 Pending Approval (NOT approved - self registered)
Do-TC "TC-11" $false ([PSCustomObject]@{
    name = "TEST TC11 NayaNivaasi PendingApproval"
    email = "tc11.pending.approval@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Resident"; gender = "Female"
    flatNo = "H-201"; phone = "9000000011"
    occupancyStatus = "Self-Occupied"
})

# TC-12 Committee Member
Do-TC "TC-12" $true ([PSCustomObject]@{
    name = "TEST TC12 Committee Member"
    email = "tc12.committee@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Committee"; gender = "Female"
    phone = "9000000012"
})

# TC-13 Security Guard
Do-TC "TC-13" $true ([PSCustomObject]@{
    name = "TEST TC13 Security Guard"
    email = "tc13.security@test.maakaushalya.com"
    password = "TestPass@2026"
    role = "Security"; gender = "Male"
    phone = "9000000013"
})

Write-Host ""
Write-Host "==========================================="-ForegroundColor Cyan
Write-Host "Created: $success | Skipped: $skipped | Failed: $failed" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ALL DONE! Password: TestPass@2026" -ForegroundColor Green
