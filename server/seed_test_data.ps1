$BASE_URL = "https://maakaushlyaaprtment.onrender.com"
$TOKEN = ""
$success = 0
$skipped = 0
$failed = 0

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   LIVE TEST DATA SEEDER" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Admin Login
$loginBody = '{"email":"admin@maakaushalya.com","password":"password123"}'
try {
    $loginResp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $TOKEN = $loginResp.token
    Write-Host "Login: OK | Token obtained" -ForegroundColor Green
} catch {
    Write-Host "Login FAILED: $_" -ForegroundColor Red
    exit 1
}

$headers = @{ Authorization = "Bearer $TOKEN" }

function Do-TC {
    param([string]$TC, [bool]$Approve, [string]$Body)
    try {
        $resp = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method POST -ContentType "application/json" -Headers $headers -Body $Body
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

# TC-01 Self-Occupied + Pet
Do-TC "TC-01" $true '{"name":"TEST TC01 RameshVerma Self-Occ Pet","email":"tc01.selfoccupied.pet@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-101","phone":"9000000001","occupancyStatus":"Self-Occupied","tenantType":"Family","familyMembers":3,"moveInDate":"2020-03-15","hasPet":true,"petDetails":"1 Golden Retriever Tommy"}'

# TC-02 Self-Occupied + Max Vehicles
Do-TC "TC-02" $true '{"name":"TEST TC02 AnilSharma MaxVehicles","email":"tc02.selfoccupied.vehicles@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-102","phone":"9000000002","occupancyStatus":"Self-Occupied","tenantType":"Family","familyMembers":2,"vehicles":"[{\"type\":\"Car\",\"number\":\"CG04TC0002\",\"sticker\":true},{\"type\":\"Bike\",\"number\":\"CG04TC0022\",\"sticker\":true},{\"type\":\"Bike\",\"number\":\"CG04TC0023\",\"sticker\":false}]","moveInDate":"2019-11-01","hasPet":false}'

# TC-03 Self-Occupied Minimal
Do-TC "TC-03" $true '{"name":"TEST TC03 VikasGupta Minimal","email":"tc03.selfoccupied.minimal@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-103","phone":"9000000003","occupancyStatus":"Self-Occupied"}'

# TC-04 Self-Occupied Female
Do-TC "TC-04" $true '{"name":"TEST TC04 PriyaSingh FemaleOwner","email":"tc04.selfoccupied.female@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Female","flatNo":"G-104","phone":"9000000004","occupancyStatus":"Self-Occupied","tenantType":"Family","familyMembers":1,"hasPet":true,"petDetails":"2 Persian Cats","moveInDate":"2022-01-10"}'

# TC-05 Rented Family Basic
Do-TC "TC-05" $true '{"name":"TEST TC05 SureshYadav FamilyTenant","email":"tc05.rented.family@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-105","phone":"9000000005","occupancyStatus":"Rented","tenantType":"Family","ownerName":"Mohan Lal Absent Owner","ownerPhone":"9000000051","familyMembers":4,"moveInDate":"2023-06-01","leaseDuration":"11 months","leaseAgreementSubmitted":false}'

# TC-06 Rented Family Lease Submitted
Do-TC "TC-06" $true '{"name":"TEST TC06 DeepakTiwari LeaseSubmitted","email":"tc06.rented.leasesub@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-106","phone":"9000000006","occupancyStatus":"Rented","tenantType":"Family","ownerName":"Subhash Chandra Owner","ownerPhone":"9000000061","familyMembers":2,"moveInDate":"2024-01-15","leaseDuration":"24 months","leaseAgreementSubmitted":true,"aadhaarNumber":"4444 5555 6666"}'

# TC-07 Bachelor Verified
Do-TC "TC-07" $true '{"name":"TEST TC07 AmitKumar BachelorVerified","email":"tc07.bachelor.verified@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-107","phone":"9000000007","occupancyStatus":"Rented","tenantType":"Bachelor","ownerName":"Raj Kishore Owner","ownerPhone":"9000000071","familyMembers":2,"moveInDate":"2024-03-01","leaseDuration":"11 months","leaseAgreementSubmitted":true,"aadhaarNumber":"7777 8888 9999","isLegacyBachelor":false}'

# TC-08 Bachelor Pending
Do-TC "TC-08" $true '{"name":"TEST TC08 RajeshPatel BachelorPending","email":"tc08.bachelor.pending@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-108","phone":"9000000008","occupancyStatus":"Rented","tenantType":"Bachelor","ownerName":"Shyam Sundar Owner","ownerPhone":"9000000081","familyMembers":3,"moveInDate":"2025-12-01","leaseDuration":"11 months","leaseAgreementSubmitted":false,"isLegacyBachelor":false}'

# TC-09 Legacy Bachelor
Do-TC "TC-09" $true '{"name":"TEST TC09 KareemKhan LegacyBachelor","email":"tc09.bachelor.legacy@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-109","phone":"9000000009","occupancyStatus":"Rented","tenantType":"Bachelor","ownerName":"Ahmad Khan Owner","ownerPhone":"9000000091","familyMembers":2,"moveInDate":"2018-05-01","leaseDuration":"11 months","leaseAgreementSubmitted":true,"aadhaarNumber":"2222 3333 4444","isLegacyBachelor":true,"exemptionRef":"RWA-2018-LEG-U001 AGM-Apr-2018"}'

# TC-10 Lease Expiring Soon
Do-TC "TC-10" $true '{"name":"TEST TC10 RahulSoni LeaseExpiring","email":"tc10.rented.expiring@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Male","flatNo":"G-110","phone":"9000000010","occupancyStatus":"Rented","tenantType":"Family","ownerName":"Mahesh Soni Owner","ownerPhone":"9000000101","familyMembers":1,"moveInDate":"2025-07-01","leaseDuration":"11 months","leaseAgreementSubmitted":true}'

# TC-11 Pending Approval (not approved)
Do-TC "TC-11" $false '{"name":"TEST TC11 NayaNivaasi PendingApproval","email":"tc11.pending.approval@test.maakaushalya.com","password":"TestPass@2026","role":"Resident","gender":"Female","flatNo":"H-201","phone":"9000000011","occupancyStatus":"Self-Occupied"}'

# TC-12 Committee Member
Do-TC "TC-12" $true '{"name":"TEST TC12 Committee Member","email":"tc12.committee@test.maakaushalya.com","password":"TestPass@2026","role":"Committee","gender":"Female","phone":"9000000012"}'

# TC-13 Security Guard
Do-TC "TC-13" $true '{"name":"TEST TC13 Security Guard","email":"tc13.security@test.maakaushalya.com","password":"TestPass@2026","role":"Security","gender":"Male","phone":"9000000013"}'

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Created: $success | Skipped: $skipped | Failed: $failed" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Password for all: TestPass@2026" -ForegroundColor Green
Write-Host ""
Write-Host "TC01 G-101 Self-Occupied + Pet"
Write-Host "TC02 G-102 Self-Occupied + Max Vehicles"
Write-Host "TC03 G-103 Self-Occupied Minimal"
Write-Host "TC04 G-104 Self-Occupied Female"
Write-Host "TC05 G-105 Rented Family Basic"
Write-Host "TC06 G-106 Rented Family Lease Submitted"
Write-Host "TC07 G-107 Rented Bachelor Verified"
Write-Host "TC08 G-108 Rented Bachelor Pending"
Write-Host "TC09 G-109 Rented Bachelor Legacy"
Write-Host "TC10 G-110 Rented Lease Expiring"
Write-Host "TC11 H-201 Pending Approval (NOT approved)"
Write-Host "TC12 ----- Committee Member"
Write-Host "TC13 ----- Security Guard"
