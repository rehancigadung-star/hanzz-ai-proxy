export default {
  /**
   * Fungsi fetch utama yang menangani semua permintaan masuk.
   * @param {Request} request - Objek permintaan masuk dari frontend.
   * @param {object} env - Variabel lingkungan (termasuk GEMINI_KEY).
   * @returns {Response} - Objek respons yang dikirim kembali ke frontend.
   */
  async fetch(request, env) {

    // 1. Tangani OPTIONS (CORS Preflight)
    // Ini penting agar frontend (dari GitHub Pages) bisa mengakses Worker.
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

    // 2. Hanya izinkan POST untuk API Call
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

    // 3. Konfigurasi dan Panggilan Gemini API
    const MODEL_NAME = "gemini-1.5-flash"; 
    
    // URL API menggunakan GEMINI_KEY dari variabel lingkungan (tersembunyi)
    const url = 
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=` +
      env.GEMINI_KEY; 

    // Ambil body request dari frontend (berisi prompt pengguna)
    const body = await request.text();

    // Kirim request ke Google Gemini API
    const apiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    // Ambil hasil respons dari Gemini
    const resultText = await apiResponse.text();

    // 4. Kembalikan Respons ke Frontend
    return new Response(resultText, {
      status: apiResponse.status,
      headers: {
        "Access-Control-Allow-Origin": "*", // Memungkinkan akses dari domain Pages Anda
        "Content-Type": "application/json"
      }
    });
  }
};
