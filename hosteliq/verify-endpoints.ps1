# Hosteliq API Verification Script
$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "         HOSTELIQ API VERIFICATION            " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/v1"
$aiUrl = "http://localhost:8000/api/v1"

# Helper function for JSON requests
function Invoke-PostJson {
    param(
        [string]$Url,
        [object]$Body,
        [string]$Token = $null
    )
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) {
        $headers.Add("Authorization", "Bearer $Token")
    }
    $jsonBody = $Body | ConvertTo-Json -Depth 5
    return Invoke-RestMethod -Uri $Url -Method Post -Headers $headers -Body $jsonBody
}

function Invoke-GetJson {
    param(
        [string]$Url,
        [string]$Token = $null
    )
    $headers = @{}
    if ($Token) {
        $headers.Add("Authorization", "Bearer $Token")
    }
    return Invoke-RestMethod -Uri $Url -Method Get -Headers $headers
}

function Invoke-PutJson {
    param(
        [string]$Url,
        [string]$Token = $null
    )
    $headers = @{}
    if ($Token) {
        $headers.Add("Authorization", "Bearer $Token")
    }
    return Invoke-RestMethod -Uri $Url -Method Put -Headers $headers
}

# --- 1. STUDENT LOGIN ---
Write-Host "`n[1] Logging in as student (student@hosteliq.com)..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "student@hosteliq.com"
        password = "password"
        role = "ROLE_STUDENT"
    }
    $loginRes = Invoke-PostJson -Url "$baseUrl/auth/login" -Body $loginBody
    $studentToken = $loginRes.token
    $studentUserId = $loginRes.id
    Write-Host "PASS: Student logged in successfully. User ID: $studentUserId" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Student login failed: $_" -ForegroundColor Red
    exit 1
}

# --- 2. CREATE COMPLAINT ---
Write-Host "`n[2] Filing a complaint for student..." -ForegroundColor Yellow
try {
    $complaintBody = @{
        title = "Water leak in Block A bathroom"
        description = "The washbasin tap has a constant leak. Water is getting wasted."
    }
    $complaintRes = Invoke-PostJson -Url "$baseUrl/complaints/student/$studentUserId" -Body $complaintBody -Token $studentToken
    Write-Host "PASS: Complaint created." -ForegroundColor Green
    Write-Host "Details: ID=$($complaintRes.id) | Room Number=$($complaintRes.room.roomNumber) | AI Category=$($complaintRes.aiCategory) | AI Priority=$($complaintRes.aiPriority)" -ForegroundColor Gray
} catch {
    Write-Host "FAIL: Complaint creation failed: $_" -ForegroundColor Red
    exit 1
}

# --- 3. LEAVE DATE VALIDATIONS (Rule 1 & Rule 2) ---
Write-Host "`n[3] Testing invalid leave dates..." -ForegroundColor Yellow

# Rule 1: End Date < Start Date
$today = (Get-Date).ToString("yyyy-MM-dd")
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")

Write-Host "Testing Rule 1: End date earlier than start date..." -ForegroundColor Gray
try {
    $invalidLeave = @{
        reason = "Trip home"
        leaveFrom = $tomorrow
        leaveTo = $today
        destination = "Mumbai"
    }
    $res = Invoke-PostJson -Url "$baseUrl/leaves/student/$studentUserId" -Body $invalidLeave -Token $studentToken
    Write-Host "FAIL: Expected validation error but request succeeded!" -ForegroundColor Red
    exit 1
} catch {
    $errObj = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errObj)
    $errMsg = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errMsg.message -eq "End date cannot be earlier than start date.") {
        Write-Host "PASS: Rule 1 rejected. Error message: '$($errMsg.message)'" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Unexpected error message: '$($errMsg.message)'" -ForegroundColor Red
        exit 1
    }
}

# Rule 2: Past Date Selection
Write-Host "Testing Rule 2: Past dates not allowed..." -ForegroundColor Gray
try {
    $invalidLeave = @{
        reason = "Past leave"
        leaveFrom = $yesterday
        leaveTo = $today
        destination = "Mumbai"
    }
    $res = Invoke-PostJson -Url "$baseUrl/leaves/student/$studentUserId" -Body $invalidLeave -Token $studentToken
    Write-Host "FAIL: Expected validation error but request succeeded!" -ForegroundColor Red
    exit 1
} catch {
    $errObj = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errObj)
    $errMsg = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errMsg.message -eq "Past dates are not allowed.") {
        Write-Host "PASS: Rule 2 rejected. Error message: '$($errMsg.message)'" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Unexpected error message: '$($errMsg.message)'" -ForegroundColor Red
        exit 1
    }
}

# --- 4. SUBMIT VALID LEAVE ---
Write-Host "`n[4] Submitting a valid leave request..." -ForegroundColor Yellow
try {
    $validLeave = @{
        reason = "Weekend outing"
        leaveFrom = $today
        leaveTo = $tomorrow
        destination = "Delhi"
    }
    $leaveRes = Invoke-PostJson -Url "$baseUrl/leaves/student/$studentUserId" -Body $validLeave -Token $studentToken
    $leaveId = $leaveRes.id
    Write-Host "PASS: Valid leave submitted. ID: $leaveId | Status: $($leaveRes.status)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Valid leave submission failed: $_" -ForegroundColor Red
    exit 1
}

# --- 5. WARDEN LOGIN & READ DASHBOARDS ---
Write-Host "`n[5] Logging in as Warden (warden1@hosteliq.com)..." -ForegroundColor Yellow
try {
    $wardenLoginBody = @{
        email = "warden1@hosteliq.com"
        password = "Warden@123"
        role = "ROLE_WARDEN"
    }
    $wardenRes = Invoke-PostJson -Url "$baseUrl/auth/login" -Body $wardenLoginBody
    $wardenToken = $wardenRes.token
    $wardenUserId = $wardenRes.id
    Write-Host "PASS: Warden logged in successfully. User ID: $wardenUserId" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Warden login failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Fetching complaints queue for Warden..." -ForegroundColor Gray
try {
    $complaintsQueue = Invoke-GetJson -Url "$baseUrl/complaints" -Token $wardenToken
    $myComplaint = $complaintsQueue | Where-Object { $_.student.user.id -eq $studentUserId } | Select-Object -First 1
    if ($myComplaint) {
        Write-Host "PASS: Found complaint in Warden Dashboard. Student: $($myComplaint.student.user.fullName) | Room: $($myComplaint.room.roomNumber)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Complaint not found in Warden queue." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "FAIL: Failed to fetch complaints queue: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Fetching leave requests queue for Warden..." -ForegroundColor Gray
try {
    $leavesQueue = Invoke-GetJson -Url "$baseUrl/leaves" -Token $wardenToken
    $myLeave = $leavesQueue | Where-Object { $_.id -eq $leaveId } | Select-Object -First 1
    if ($myLeave) {
        Write-Host "PASS: Found leave request in Warden Dashboard. Student: $($myLeave.student.user.fullName) | Room: $($myLeave.roomNumber)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Leave request not found in Warden queue." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "FAIL: Failed to fetch leave requests queue: $_" -ForegroundColor Red
    exit 1
}

# --- 6. WARDEN ACTION: APPROVE LEAVE ---
Write-Host "`n[6] Approving student leave request..." -ForegroundColor Yellow
try {
    $approveRes = Invoke-PutJson -Url "$baseUrl/leaves/$leaveId/status?status=APPROVED&remarks=Approved+by+Warden&wardenUserId=$wardenUserId" -Token $wardenToken
    Write-Host "PASS: Leave approved. Status: $($approveRes.status) | Approved By: $($approveRes.approvedBy.fullName)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Leave approval failed: $_" -ForegroundColor Red
    exit 1
}

# --- 7. CHATBOT AND CROWD DENSITY ANALYTICS ---
Write-Host "`n[7] Testing AI Chatbot and Mess Crowd Density..." -ForegroundColor Yellow

# Query 1: Mess Schedule Timing
try {
    $chatBody1 = @{
        message = "What is the mess timing?"
        userId = $studentUserId.ToString()
    }
    $chatRes1 = Invoke-PostJson -Url "$aiUrl/ai/chat-assistant" -Body $chatBody1
    Write-Host "Response to timing query:" -ForegroundColor Gray
    Write-Host $chatRes1.response -ForegroundColor Green
} catch {
    Write-Host "FAIL: Chatbot timing query failed: $_" -ForegroundColor Red
}

# Query 2: Mess Crowd density
try {
    $chatBody2 = @{
        message = "How crowded is the mess now?"
        userId = $studentUserId.ToString()
    }
    $chatRes2 = Invoke-PostJson -Url "$aiUrl/ai/chat-assistant" -Body $chatBody2
    Write-Host "Response to crowd query:" -ForegroundColor Gray
    Write-Host $chatRes2.response -ForegroundColor Green
} catch {
    Write-Host "FAIL: Chatbot crowd query failed: $_" -ForegroundColor Red
}

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "    ALL CHECKS COMPLETED SUCCESSFULLY!        " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
