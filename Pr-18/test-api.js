#!/usr/bin/env node

const axios = require("axios");

const BASE_URL = "http://localhost:3007";
const API_URL = `${BASE_URL}/api/notes`;

// ANSI color codes for console output
const colors = {
	green: "\x1b[32m",
	red: "\x1b[31m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	reset: "\x1b[0m",
	bold: "\x1b[1m",
};

function log(message, color = "reset") {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
	log("\n🚀 Testing Notes API - Practical 18", "bold");
	log("=".repeat(50), "blue");

	try {
		// 1. Test API Documentation
		log("\n📖 1. Testing API Documentation...", "blue");
		const docResponse = await axios.get(BASE_URL);
		log(`✅ Status: ${docResponse.status}`, "green");
		log(`📱 Message: ${docResponse.data.message}`, "yellow");

		// 2. Test GET all notes (initially empty)
		log("\n📋 2. Getting all notes (initially empty)...", "blue");
		const getAllResponse = await axios.get(API_URL);
		log(`✅ Status: ${getAllResponse.status}`, "green");
		log(`📊 Found ${getAllResponse.data.count} notes`, "yellow");

		// 3. Test POST - Create first note
		log("\n➕ 3. Creating first note...", "blue");
		const note1Data = {
			title: "Welcome to Notes API",
			content:
				"This is the first note created via API. The notes app supports full CRUD operations with MongoDB Atlas integration!",
		};

		const createResponse1 = await axios.post(API_URL, note1Data);
		log(`✅ Status: ${createResponse1.status}`, "green");
		log(`📝 Created: ${createResponse1.data.data.title}`, "yellow");
		const note1Id = createResponse1.data.data._id;

		// 4. Test POST - Create second note
		log("\n➕ 4. Creating second note...", "blue");
		const note2Data = {
			title: "API Testing Guide",
			content:
				"You can use Postman, curl, or any HTTP client to test this API. All endpoints return JSON responses with proper status codes.",
		};

		const createResponse2 = await axios.post(API_URL, note2Data);
		log(`✅ Status: ${createResponse2.status}`, "green");
		log(`📝 Created: ${createResponse2.data.data.title}`, "yellow");
		const note2Id = createResponse2.data.data._id;

		// 5. Test GET all notes (now with data)
		log("\n📋 5. Getting all notes (with data)...", "blue");
		const getAllResponse2 = await axios.get(API_URL);
		log(`✅ Status: ${getAllResponse2.status}`, "green");
		log(`📊 Found ${getAllResponse2.data.count} notes`, "yellow");
		getAllResponse2.data.data.forEach((note, index) => {
			log(
				`   ${index + 1}. ${note.title} (${new Date(
					note.createdAt
				).toLocaleString()})`,
				"reset"
			);
		});

		// 6. Test GET single note
		log("\n🔍 6. Getting single note by ID...", "blue");
		const getSingleResponse = await axios.get(`${API_URL}/${note1Id}`);
		log(`✅ Status: ${getSingleResponse.status}`, "green");
		log(`📝 Title: ${getSingleResponse.data.data.title}`, "yellow");
		log(
			`📄 Content: ${getSingleResponse.data.data.content.substring(0, 50)}...`,
			"reset"
		);

		// 7. Test PUT - Update note
		log("\n✏️  7. Updating note...", "blue");
		const updateData = {
			title: "Welcome to Notes API (Updated)",
			content:
				"This note has been updated! The API supports real-time updates with automatic timestamp management.",
		};

		const updateResponse = await axios.put(`${API_URL}/${note1Id}`, updateData);
		log(`✅ Status: ${updateResponse.status}`, "green");
		log(`📝 Updated: ${updateResponse.data.data.title}`, "yellow");

		// 8. Test DELETE - Remove note
		log("\n🗑️  8. Deleting second note...", "blue");
		const deleteResponse = await axios.delete(`${API_URL}/${note2Id}`);
		log(`✅ Status: ${deleteResponse.status}`, "green");
		log(`🗑️  Deleted: ${deleteResponse.data.data.title}`, "yellow");

		// 9. Final GET to verify changes
		log("\n📋 9. Final check - Getting remaining notes...", "blue");
		const finalGetResponse = await axios.get(API_URL);
		log(`✅ Status: ${finalGetResponse.status}`, "green");
		log(`📊 Remaining notes: ${finalGetResponse.data.count}`, "yellow");

		// Test Summary
		log("\n" + "=".repeat(50), "blue");
		log("✅ All API tests completed successfully!", "green");
		log("\n📱 Mobile App Integration Ready:", "bold");
		log(`   • API Base URL: ${BASE_URL}`, "reset");
		log(`   • Notes Endpoint: ${API_URL}`, "reset");
		log(`   • Database: MongoDB Atlas`, "reset");
		log(`   • Status: 🟢 Connected and Working`, "green");

		log("\n🔧 Next Steps:", "bold");
		log("   1. Import postman_collection.json into Postman", "reset");
		log("   2. Test all endpoints manually", "reset");
		log("   3. Integrate with your mobile application", "reset");
		log("   4. Deploy to production when ready", "reset");
	} catch (error) {
		log("\n❌ API Test Failed:", "red");

		if (error.response) {
			log(`Status: ${error.response.status}`, "red");
			log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, "red");
		} else if (error.request) {
			log("Network Error: No response received", "red");
			log("Make sure the server is running on http://localhost:3007", "yellow");
		} else {
			log(`Error: ${error.message}`, "red");
		}
	}
}

// Install axios if not already installed and run the test
async function main() {
	try {
		await testAPI();
	} catch (error) {
		if (error.code === "MODULE_NOT_FOUND") {
			log("\n📦 Installing axios for API testing...", "yellow");
			const { exec } = require("child_process");
			exec("npm install axios", (err, stdout, stderr) => {
				if (err) {
					log(
						"❌ Failed to install axios. Please install manually: npm install axios",
						"red"
					);
					return;
				}
				log("✅ Axios installed successfully!", "green");
				log("🔄 Rerun this script to test the API", "yellow");
			});
		} else {
			throw error;
		}
	}
}

main();
