const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

loadEnvFile(path.join(ROOT_DIR, ".env"));

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function stripCodeFences(text) {
  return text.replace(/```json|```/gi, "").trim();
}

async function fetchWeatherSummary(city) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`
    );
    const geo = await geoRes.json();
    const first = geo?.results?.[0];
    if (!first) {
      return { summary: "Konum icin hava verisi bulunamadi", currentTempC: null };
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${first.latitude}&longitude=${first.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&current=temperature_2m,weather_code&timezone=auto`
    );
    const weather = await weatherRes.json();
    const current = weather?.current || {};
    const daily = weather?.daily || {};
    const currentTempC = Math.round(current.temperature_2m ?? 20);
    const summary = `🌦️ ${first.name}: ${currentTempC}C, Min ${Math.round(
      (daily.temperature_2m_min || [0])[0]
    )}C / Max ${Math.round((daily.temperature_2m_max || [0])[0])}C, Yagis olasiligi %${Math.round(
      (daily.precipitation_probability_max || [0])[0]
    )}, UV ${Math.round((daily.uv_index_max || [0])[0])}`;
    return { summary, currentTempC };
  } catch {
    return { summary: "Hava durumu servisine ulasilamadi", currentTempC: null };
  }
}

function fallbackCalendar(growType, userLevel) {
  const sample = [
    { emoji: "💧", taskName: "Su", task: "Topragi kontrol et ve nazik sulama yap." },
    { emoji: "🌱", taskName: "Ekim", task: "Fide ve kok bolgesini gozlemle." },
    { emoji: "🧪", taskName: "Besin", task: "Denge dozda besin takviyesi ver." },
    { emoji: "⛏️", taskName: "Capa", task: "Yuzeyi hafif havalandir." },
    { emoji: "✂️", taskName: "Budama", task: "Hastali yapraklari temizle." },
    { emoji: "🌞", taskName: "Isik", task: "Uygun isikta kalma suresini ayarla." },
    { emoji: "🧤", taskName: "Hasat", task: "Olgun meyveleri nazikce topla." },
    { emoji: "❄️", taskName: "Koruma", task: "Soguk/gece kosullarina karsi koru." },
  ];

  const days = Array.from({ length: 30 }, (_, i) => {
    const selected = sample[i % sample.length];
    const amount =
      growType === "Saksi"
        ? selected.emoji === "💧"
          ? "Orn: 300ml su"
          : "Ml bazli kucuk doz"
        : "Meteorolojiye gore ayarla";
    return {
      day: i + 1,
      emoji: selected.emoji,
      taskName: selected.taskName,
      task: selected.task,
      detail:
        growType === "Saksi"
          ? `${selected.task} Don riski yerine toprak nemi ve ic mekan dengesine odaklan.`
          : `${selected.task} Don, yagis, UV ve ruzgar riskini gunluk kontrol et.`,
      detailLevel: userLevel === "Profesyonel" ? "detayli" : "sade",
      amount,
    };
  });

  return {
    days,
    dailyTip: "Bugunun Cilek Sirri: Ciceklenmede yumusak firca ile tozlasma verimi artirir.",
  };
}

async function generateCalendarFromGemini(city, growType, userLevel) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackCalendar(growType, userLevel);
  }

  const prompt = `
Sen deneyimli bir ziraat uzmansin. Cilek yetistiricisi icin 30 gunluk plan hazirla.
Sehir: ${city}
Yetistirme tipi: ${growType}
Kullanim seviyesi: ${userLevel || "Hobi"}

Kurallar:
- Sadece gecerli JSON don.
- JSON su formatta olsun:
{
  "days": [
    { "day": 1, "emoji": "💧", "taskName": "Su", "task": "Kisa gorev", "detail": "En fazla 2 cumle.", "amount": "Orn: 300ml su" }
  ],
  "dailyTip": "Bugunun Cilek Sirri: ..."
}
- days dizisi tam 30 elemanli olsun, day 1-30 arasi.
- Emoji su listeden secilsin: 💧, 🌱, 🧪, ⛏️, ✂️, 🌞, 🧤, ❄️
- Saksi icin don uyarilarini azalt, sulama dilini ml odakli tut.
- Tarla icin don/UV/yagis risklerini belirginlestir.
- Profesyonel seviyede biraz daha teknik ve detayli yaz, hobi seviyesinde sade yaz.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
      }),
    }
  );

  if (!response.ok) {
    return fallbackCalendar(growType, userLevel);
  }

  const raw = await response.json();
  const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return fallbackCalendar(growType, userLevel);
  }

  const parsed = safeJsonParse(stripCodeFences(text));
  if (!parsed || !Array.isArray(parsed.days)) {
    return fallbackCalendar(growType, userLevel);
  }

  const normalizedDays = parsed.days.slice(0, 30).map((item, idx) => ({
    day: Number(item.day) || idx + 1,
    emoji: String(item.emoji || "🌱"),
    taskName: String(item.taskName || "Gorev"),
    task: String(item.task || "Bitkiyi gozlemle"),
    detail: String(item.detail || item.task || "Bitkiyi gozlemle."),
    amount: String(
      item.amount ||
        (growType === "Saksi" ? "Orn: 300ml su" : "Meteorolojiye gore ayarla")
    ),
  }));

  while (normalizedDays.length < 30) {
    normalizedDays.push({
      day: normalizedDays.length + 1,
      emoji: "🌱",
      taskName: "Gorev",
      task: "Bitkiyi gozlemle",
      detail: "Bitkiyi gozlemle.",
      amount: growType === "Saksi" ? "Orn: 300ml su" : "Meteorolojiye gore ayarla",
    });
  }

  return {
    days: normalizedDays,
    dailyTip: String(parsed.dailyTip || "Yaprak ve nem dengesini gunluk takip et."),
  };
}

async function chatWithGemini({ message, imageBase64, mimeType, profile }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const city = profile?.city || "bilinmiyor";
  const growType = profile?.growType || "bilinmiyor";
  if (!apiKey) {
    return `Sistem su an ornek modda. ${city} / ${growType} icin kisa yanit: toprak nemi, yaprak alti kontrolu ve dengeli sulama ile ilerle.`;
  }

  const prompt = `Sen Ziraat Muhendisi Cilek Ustasisin. Kullaniciya telefon ekranina sigacak kisa, net, pratik yanit ver.
Konum: ${city}
Tip: ${growType}
Soru: ${message || "Kullanici fotograf gonderdi"}
`;

  const parts = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: mimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.45 } }),
    }
  );

  if (!response.ok) {
    return "Su an sohbet servisine ulasilamadi. Kisa sure sonra tekrar dene.";
  }
  const raw = await response.json();
  return raw?.candidates?.[0]?.content?.parts?.[0]?.text || "Yanit alinamadi.";
}

async function analyzeImageWithGemini(imageBase64, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return [
      "Hastalik belirtileri olasi, gorsel net degil.",
      "Yaprak altlarini kontrol et ve hasarli bolgeleri ayir.",
      "Sulama ve hava sirkulasyonunu dengede tut.",
    ].join("\n");
  }

  const prompt = `
Yuklenen cilek fotografini analiz et.
Turkce ve net cevap ver.
Format:
1) Olasi teshis
2) Acil adim 1
3) Acil adim 2
4) Acil adim 3
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType || "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.3 },
      }),
    }
  );

  if (!response.ok) {
    return [
      "Gorsel analizi su an tamamlanamadi.",
      "Yapraklarda leke veya kuf var mi kontrol et.",
      "Hastalikli bolgeleri ayir ve temiz ekipman kullan.",
      "Bir uzmana gorsel ile tekrar danis.",
    ].join("\n");
  }

  const raw = await response.json();
  return (
    raw?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Analiz sonucu alinamadi. Daha net bir fotograf yukleyin."
  );
}

function serveStatic(req, res) {
  const cleanPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(ROOT_DIR, decodeURIComponent(cleanPath));

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/calendar") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = safeJsonParse(body);
      if (!data?.city || !data?.growType) {
        sendJson(res, 400, { error: "city ve growType gereklidir." });
        return;
      }

      try {
        const result = await generateCalendarFromGemini(
          data.city,
          data.growType,
          data.userLevel
        );
        const weather = await fetchWeatherSummary(data.city);
        sendJson(res, 200, {
          ...result,
          weatherSummary: weather.summary,
          currentTempC: weather.currentTempC,
        });
      } catch (error) {
        const fallback = fallbackCalendar(data.growType, data.userLevel);
        const weather = await fetchWeatherSummary(data.city);
        sendJson(res, 200, {
          ...fallback,
          weatherSummary: weather.summary,
          currentTempC: weather.currentTempC,
          warning: "AI servisi gecici olarak kullanilamadi, ornek takvim gosterildi.",
        });
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/vision") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = safeJsonParse(body);
      if (!data?.imageBase64) {
        sendJson(res, 400, { error: "imageBase64 gereklidir." });
        return;
      }

      try {
        const analysis = await analyzeImageWithGemini(
          String(data.imageBase64),
          String(data.mimeType || "image/jpeg")
        );
        sendJson(res, 200, { analysis });
      } catch (error) {
        sendJson(res, 200, {
          analysis:
            "1) Kesin teshis icin gorsel yetersiz.\n2) Etkilenen yapraklari ayir.\n3) Sulama duzenini azalt.\n4) Gerekirse uzman kontrolu sagla.",
          warning: "Vision servisi gecici olarak kullanilamadi.",
        });
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const data = safeJsonParse(body) || {};
      try {
        const reply = await chatWithGemini(data);
        sendJson(res, 200, { reply });
      } catch {
        sendJson(res, 200, { reply: "Sohbet servisinde gecici bir sorun var." });
      }
    });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Akilli Cilek Asistani calisiyor: http://localhost:${PORT}`);
});
