@echo off
echo ==========================================
echo    Portable MongoDB Setup
echo ==========================================
echo.

echo This script will help you run MongoDB without installation
echo.

echo Step 1: Create MongoDB directories
mkdir C:\temp-mongodb\data 2>nul
mkdir C:\temp-mongodb\logs 2>nul
echo ✅ Directories created

echo.
echo Step 2: Download portable MongoDB
echo.
echo Please download MongoDB ZIP file:
echo 1. Go to: https://www.mongodb.com/try/download/community
echo 2. Select: Windows, Latest Version, ZIP Archive
echo 3. Extract to C:\temp-mongodb\
echo.

echo Expected structure:
echo C:\temp-mongodb\
echo   ├── data\
echo   ├── logs\
echo   └── mongodb-win32-x86_64-6.x.x\
echo       └── bin\
echo           ├── mongod.exe
echo           └── mongosh.exe
echo.

pause

echo Step 3: Start MongoDB manually
echo.
echo Copy and run this command in a NEW command prompt:
echo.
echo cd /d C:\temp-mongodb\mongodb-win32-x86_64-*\bin
echo mongod --dbpath "C:\temp-mongodb\data" --logpath "C:\temp-mongodb\logs\mongo.log"
echo.
echo Keep that window open while using your Node.js app
echo.

pause
