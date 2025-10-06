@echo off
echo ==========================================
echo    MongoDB Local Installation Script
echo ==========================================
echo.

echo Step 1: Download MongoDB Community Server
echo.
echo Please follow these steps manually:
echo 1. Open browser and go to: https://www.mongodb.com/try/download/community
echo 2. Select: Windows, Latest Version, MSI Package
echo 3. Download the file
echo 4. Run the MSI installer as Administrator
echo 5. Choose "Complete" installation
echo 6. IMPORTANT: Check "Install MongoDB as a Service"
echo 7. Service Name: MongoDB
echo 8. Run as: Local Service or Network Service
echo.

pause

echo Step 2: Verify Installation
echo.

echo Checking if MongoDB service exists...
sc query MongoDB > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB service found!
    echo.
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% == 0 (
        echo ✅ MongoDB started successfully!
        echo.
        echo Testing connection...
        timeout /t 3 > nul
        netstat -an | findstr 27017
        if %errorlevel% == 0 (
            echo ✅ MongoDB is running on port 27017
        ) else (
            echo ❌ MongoDB port 27017 not found
        )
    ) else (
        echo ❌ Failed to start MongoDB service
    )
) else (
    echo ❌ MongoDB service not found
    echo.
    echo Please install MongoDB Community Server first:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo Make sure to check "Install as Service" during installation
)

echo.
echo Step 3: Test with Node.js
echo.
echo If MongoDB is running, your Node.js app should connect successfully.
echo Navigate to Practical_17 folder and run: node server.js
echo.

pause
