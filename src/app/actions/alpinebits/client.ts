// AlpineBits HTTP Client with Basic Auth and gzip support

import * as pako from "pako";
import type { AlpineBitsPostOptions, AlpineBitsResponse } from "./types";

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const ALPINEBITS_ENDPOINT = process.env.ALPINEBITS_ENDPOINT;
const ALPINEBITS_USERNAME = process.env.ALPINEBITS_USERNAME;
const ALPINEBITS_PASSWORD = process.env.ALPINEBITS_PASSWORD;
const ALPINEBITS_PROTOCOL_VERSION =
  process.env.ALPINEBITS_PROTOCOL_VERSION ?? "2024-10";

/**
 * Validate that all required environment variables are set
 */
function validateEnvVars(): void {
  if (!ALPINEBITS_ENDPOINT) {
    throw new Error(
      "ALPINEBITS_ENDPOINT environment variable is not set. Please configure it in .env.local",
    );
  }
  if (!ALPINEBITS_USERNAME) {
    throw new Error(
      "ALPINEBITS_USERNAME environment variable is not set. Please configure it in .env.local",
    );
  }
  if (!ALPINEBITS_PASSWORD) {
    throw new Error(
      "ALPINEBITS_PASSWORD environment variable is not set. Please configure it in .env.local",
    );
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Generate Basic Auth header
 */
function getAuthHeader(): string {
  const token = Buffer.from(
    `${ALPINEBITS_USERNAME}:${ALPINEBITS_PASSWORD}`,
    "utf-8",
  ).toString("base64");
  return `Basic ${token}`;
}

// ============================================================================
// GZIP COMPRESSION
// ============================================================================

/**
 * Compress data using gzip
 */
function compressData(data: string): Uint8Array {
  return pako.gzip(data);
}

/**
 * Create multipart form data with gzip compression
 * When compressing, the entire multipart body is compressed, not individual parts
 */
async function createCompressedFormData(
  action: string,
  xmlRequest?: string,
): Promise<{ body: Uint8Array; boundary: string }> {
  // Create a standard multipart form data string
  const boundary = `----AlpineBitsBoundary${Date.now()}`;
  let formDataString = "";

  // Add action field
  formDataString += `--${boundary}\r\n`;
  formDataString += `Content-Disposition: form-data; name="action"\r\n\r\n`;
  formDataString += `${action}\r\n`;

  // Add request field if provided
  if (xmlRequest) {
    formDataString += `--${boundary}\r\n`;
    formDataString += `Content-Disposition: form-data; name="request"; filename="request.xml"\r\n`;
    formDataString += `Content-Type: application/xml\r\n\r\n`;
    formDataString += `${xmlRequest}\r\n`;
  }

  formDataString += `--${boundary}--\r\n`;

  // Compress the entire multipart body
  const compressed = compressData(formDataString);

  return { body: compressed, boundary };
}

// ============================================================================
// HTTP CLIENT
// ============================================================================

/**
 * Low-level POST to an AlpineBits server
 * Sends multipart/form-data with fields "action" and "request"
 * Includes required AlpineBits headers and optional gzip compression
 */
export async function postAlpineBits({
  action,
  xmlRequest,
  compress = false,
}: AlpineBitsPostOptions): Promise<AlpineBitsResponse> {
  // Validate environment variables
  validateEnvVars();

  try {
    let body: FormData | Uint8Array;
    const headers: Record<string, string> = {
      Authorization: getAuthHeader(),
      "X-AlpineBits-ClientProtocolVersion": ALPINEBITS_PROTOCOL_VERSION,
    };

    if (compress) {
      // Create compressed multipart data
      const { body: compressedBody, boundary } = await createCompressedFormData(
        action,
        xmlRequest,
      );

      body = compressedBody;
      headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
      headers["Content-Encoding"] = "gzip";
    } else {
      // Create standard FormData
      const formData = new FormData();
      formData.append("action", action);

      if (xmlRequest) {
        // Create a Blob with the XML content
        formData.append(
          "request",
          new Blob([xmlRequest], { type: "application/xml" }),
          "request.xml",
        );
      }

      body = formData;
      // Note: Don't set Content-Type header for FormData, fetch will set it automatically with boundary
    }

    // Make the HTTP request
    const res = await fetch(ALPINEBITS_ENDPOINT!, {
      method: "POST",
      headers: compress ? headers : { ...headers },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: body as any,
      cache: "no-store", // Don't cache AlpineBits requests
    });

    const responseText = await res.text();

    // If HTTP code is not 2xx, the server may return plain text starting with "ERROR:"
    if (!res.ok) {
      // Check if response starts with "ERROR:"
      if (responseText.startsWith("ERROR:")) {
        throw new Error(`AlpineBits Error: ${responseText}`);
      }
      throw new Error(
        `AlpineBits HTTP ${res.status}: ${responseText || res.statusText}`,
      );
    }

    return {
      status: res.status,
      body: responseText,
      compressed: compress,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`AlpineBits request failed: ${String(error)}`);
  }
}

/**
 * Check if gzip compression is supported by the server
 * This should be called after a handshake to check the server's response headers
 */
export function checkGzipSupport(headers: Headers): boolean {
  const acceptEncoding = headers.get("X-AlpineBits-Server-Accept-Encoding");
  return acceptEncoding?.includes("gzip") ?? false;
}
