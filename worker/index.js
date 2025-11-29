export default {
  async fetch(request, env) {

    // 1. Tangani OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 2. Hanya izinkan POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed. POST only" }),
        {
          status: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
    }

    // 3. Request ke Gemini API
    const MODEL_NAME = "gemini-1.5-flash";
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=` +
      env.GEMINI_KEY;

    const body = await request.text();

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    const resultText = await apiResponse.text();

    return new Response(resultText, {
      status: apiResponse.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
};
