// Silent fetch wrapper that doesn't log network errors to console
// This prevents "Failed to fetch" errors from cluttering the console
// when the backend server is not running

export const silentFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  try {
    return await fetch(input, init);
  } catch (error) {
    // Check if this is a network error (backend not available)
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("ERR_NETWORK") ||
        error.message.includes("ECONNREFUSED"))
    ) {
      // Create a fake Response object to indicate network failure
      throw new Error("NETWORK_ERROR");
    }

    // Re-throw other errors as-is
    throw error;
  }
};
