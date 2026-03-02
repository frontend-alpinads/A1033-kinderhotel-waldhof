import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const API_BASE_URL = "https://quote-request-alpha.vercel.app";
const CREATE_HOTEL_ENDPOINT = `${API_BASE_URL}/api/create-hotel`;

interface CreateHotelRequest {
  code: string;
  name: string;
  username: string;
  password: string;
  isActive?: boolean;
}

interface CreateHotelResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    code: string;
    name: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

async function createHotelCredentials(
  apiKey: string,
  payload: CreateHotelRequest,
): Promise<CreateHotelResponse> {
  const response = await fetch(CREATE_HOTEL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as CreateHotelResponse;

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}: ${body.message || JSON.stringify(body)}`,
    );
  }

  return body;
}

async function main() {
  const {
    ALPINEBITS_HOTEL_USER,
    ALPINEBITS_HOTEL_PASSWORD,
    ALPINEBITS_HOTEL_CODE,
    ALPINEBITS_HOTEL_NAME,
    QR_API_KEY,
  } = process.env;

  // Validate required environment variables
  const missing = [
    !ALPINEBITS_HOTEL_USER && "ALPINEBITS_HOTEL_USER",
    !ALPINEBITS_HOTEL_PASSWORD && "ALPINEBITS_HOTEL_PASSWORD",
    !ALPINEBITS_HOTEL_CODE && "ALPINEBITS_HOTEL_CODE",
    !ALPINEBITS_HOTEL_NAME && "ALPINEBITS_HOTEL_NAME",
    !QR_API_KEY && "QR_API_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    for (const v of missing) {
      console.error(`  - ${v}`);
    }
    console.error("\nPlease add them to your .env.local file.");
    process.exit(1);
  }

  const payload: CreateHotelRequest = {
    code: ALPINEBITS_HOTEL_CODE!,
    name: ALPINEBITS_HOTEL_NAME!,
    username: ALPINEBITS_HOTEL_USER!,
    password: ALPINEBITS_HOTEL_PASSWORD!,
  };

  console.log("Creating hotel credentials with:");
  console.log(`  Code:     ${payload.code}`);
  console.log(`  Name:     ${payload.name}`);
  console.log(`  Username: ${payload.username}`);
  console.log(`  Password: ${"*".repeat(payload.password.length)}`);
  console.log();

  try {
    const result = await createHotelCredentials(QR_API_KEY!, payload);

    console.log("✅ Hotel credentials created successfully!\n");
    console.log("Response:", JSON.stringify(result, null, 2));

    if (result.data) {
      console.log("\nCreated hotel details:");
      console.log(`  ID:        ${result.data.id}`);
      console.log(`  Code:      ${result.data.code}`);
      console.log(`  Name:      ${result.data.name}`);
      console.log(`  Username:  ${result.data.username}`);
      console.log(`  Is Active: ${result.data.isActive}`);
      console.log(`  Created:   ${result.data.createdAt}`);
    }
  } catch (error) {
    console.error("❌ Failed to create hotel credentials:");
    console.error(
      `   ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main();
