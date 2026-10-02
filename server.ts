import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Razorpay Client
let razorpayClient: Razorpay | null = null;
function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret && !razorpayClient) {
    razorpayClient = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return razorpayClient;
}

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// 2. AI Wedding Budget Planner Endpoint
app.post("/api/gemini/budget-planner", async (req, res) => {
  try {
    const { totalBudget, guestCount, city, weddingStyle, culturalTradition, priorities } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured, client heuristic planner applied"
      });
    }

    const prompt = `You are the master wedding budget strategist for Elysian Wedlock, India's premier luxury wedding and milestone celebration platform.
Calculate an optimal, highly detailed financial allocation for a wedding with:
- Total Budget: ₹${totalBudget} (INR)
- Estimated Guests: ${guestCount}
- City / State: ${city}
- Wedding Style / Vibe: ${weddingStyle}
- Cultural Tradition / Rites: ${culturalTradition || "Pan-Indian Royal"}
- Key Client Priorities: ${Array.isArray(priorities) ? priorities.join(", ") : "Balanced Luxury"}

Please return a valid JSON object matching this structure:
{
  "totalBudget": ${totalBudget},
  "guestCount": ${guestCount},
  "city": "${city}",
  "weddingStyle": "${weddingStyle}",
  "culturalTradition": "${culturalTradition || 'Pan-Indian Royal'}",
  "estimatedCostPerGuest": ${Math.round((totalBudget || 1000000) / (guestCount || 500))},
  "allocations": [
    {
      "category": "Marriage Hall & Mandapam",
      "categoryKey": "venue",
      "percentage": 35,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.35)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    },
    {
      "category": "Catering & Banqueting",
      "categoryKey": "catering",
      "percentage": 30,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.30)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    },
    {
      "category": "Photography & 4K Cinema",
      "categoryKey": "photography",
      "percentage": 15,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.15)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    },
    {
      "category": "Theme Stage & Floral Decor",
      "categoryKey": "decor",
      "percentage": 10,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.10)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    },
    {
      "category": "Music, Mehendi & Entertainment",
      "categoryKey": "entertainment",
      "percentage": 5,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.05)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    },
    {
      "category": "Puja Samagri, Favors & Contingency",
      "categoryKey": "contingency",
      "percentage": 5,
      "allocatedAmount": ${Math.round((totalBudget || 1000000) * 0.05)},
      "recommendedPackages": ["string package name 1", "string package name 2"],
      "costSavingTip": "string actionable tip"
    }
  ],
  "aiStrategicInsights": ["string insight 1", "string insight 2", "string insight 3"],
  "auspiciousDateTips": "string auspicious muhurtham strategy",
  "negotiationChecklist": ["item 1", "item 2", "item 3", "item 4"]
}
Ensure all numeric calculations sum to ${totalBudget}. Provide only raw valid JSON without markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Budget Planner Error:", error);
    res.status(500).json({ error: "Failed to generate budget plan with AI", details: error?.message });
  }
});

// 3. AI Vendor Review Highlights Endpoint
app.post("/api/gemini/review-highlights", async (req, res) => {
  try {
    const { vendorId, vendorName, category, location, rating, reviewsCount } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured, fallback synthesizer used"
      });
    }

    const prompt = `You are the executive luxury critic and sentiment analyst for Elysian Wedlock.
Synthesize verified customer feedback, performance reviews, and service highlights for:
- Vendor Name: ${vendorName}
- Category: ${category} (Marriage Hall / Caterer / Photographer / Decorator)
- Location: ${location || "India"}
- Base Rating: ${rating || 4.9} / 5.0 (${reviewsCount || 85}+ verified events)

Return a JSON object with this exact structure:
{
  "vendorId": "${vendorId || 'v-1'}",
  "vendorName": "${vendorName}",
  "category": "${category}",
  "sentimentScore": 98,
  "overallVerdict": "A 2-sentence executive summary of why this vendor is exceptional.",
  "keyHighlights": [
    "Highlight point 1 with specific praise",
    "Highlight point 2 with specific praise",
    "Highlight point 3 with specific praise"
  ],
  "pros": [
    "Distinct advantage 1",
    "Distinct advantage 2",
    "Distinct advantage 3"
  ],
  "considerations": [
    "Helpful booking note or season advice 1",
    "Helpful booking note or season advice 2"
  ],
  "bestSuitedFor": [
    "Occasion type 1",
    "Occasion type 2",
    "Occasion type 3"
  ],
  "topCoupleQuotes": [
    {
      "quote": "Quote snippet from a delighted couple",
      "couple": "Priya & Rahul",
      "occasion": "Kalyana Mandapam Muhurtham",
      "rating": 5
    },
    {
      "quote": "Quote snippet praising specific details",
      "couple": "Ananya & Vikram",
      "occasion": "Royal Reception",
      "rating": 5
    }
  ]
}
Provide only raw valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Review Highlights Error:", error);
    res.status(500).json({ error: "Failed to synthesize review highlights", details: error?.message });
  }
});

// 4. AI Vendor Analytics Strategic Insights Endpoint
app.post("/api/gemini/vendor-insights", async (req, res) => {
  try {
    const { vendorName, category, monthlyRevenue, conversionRate, totalBookings } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured, fallback insights used"
      });
    }

    const prompt = `You are the Chief Commercial Officer & Growth Strategist for Elysian Wedlock.
Generate high-impact growth and yield management advice for this verified vendor:
- Vendor: ${vendorName}
- Category: ${category}
- Monthly Revenue: ₹${monthlyRevenue}
- Conversion Rate: ${conversionRate}%
- Total Confirmed Bookings: ${totalBookings}

Return a valid JSON object:
{
  "overallHealthScore": 95,
  "summary": "Executive summary of current market positioning",
  "highDemandWindows": [
    "Upcoming peak dates and seasonal windows"
  ],
  "pricingOptimizationTips": [
    "Actionable pricing and yield management recommendation 1",
    "Actionable pricing and yield management recommendation 2",
    "Actionable pricing and yield management recommendation 3"
  ],
  "conversionBoostActions": [
    "Immediate step to increase inquiry close rate 1",
    "Immediate step to increase inquiry close rate 2"
  ],
  "recommendedAddons": [
    "High-margin luxury add-on package 1",
    "High-margin luxury add-on package 2"
  ]
}
Provide only raw valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Vendor Insights Error:", error);
    res.status(500).json({ error: "Failed to generate vendor insights", details: error?.message });
  }
});

// 5. AI Wedding Concierge Assistant Endpoint
app.post("/api/gemini/wedding-assistant", async (req, res) => {
  try {
    const { message, history, userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `Namaste! I am your Elysian Wedding Concierge. How may I assist with your auspicious dates, kalyana mandapam selection, royal banqueting menus, candid photographers, or themed floral decor today?`
      });
    }

    const systemInstruction = `You are Elysian AI, the master wedding curator and ritual concierge for Elysian Wedlock, India's most prestigious celebration booking platform.
You are deeply knowledgeable in Indian weddings, Vedic Muhurtham rituals, Christian Nuptials, Islamic Nikahs, First Birthdays, Sangeets, and Pan-Indian banqueting.
Be courteous, warm, culturally respectful, and concise with practical recommendations of halls, caterers, photographers, and decor styles.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Client Question: ${message}`,
      config: {
        systemInstruction
      }
    });

    res.json({ reply: response.text || "I am at your service to curate your dream celebration." });
  } catch (error: any) {
    console.error("Gemini Concierge Error:", error);
    res.status(500).json({ error: "Concierge response unavailable", details: error?.message });
  }
});

// 6. Razorpay Payment Gateway Configuration
app.get("/api/razorpay/config", (req, res) => {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_elysian_luxury";
  const hasSecret = !!process.env.RAZORPAY_KEY_SECRET;
  const isReal = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  res.json({
    configured: isReal,
    testMode: !isReal,
    keyId: key_id,
    currency: "INR",
    companyName: "Elysian Wedlock Escrow Services",
    themeColor: "#C5A059"
  });
});

// 7. Razorpay Create Order Endpoint
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid payment amount is required" });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}`;
    const rzp = getRazorpayClient();

    if (rzp) {
      const order = await rzp.orders.create({
        amount: amountInPaise,
        currency,
        receipt: orderReceipt,
        notes: {
          platform: "Elysian Wedlock",
          ...notes
        }
      });

      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID,
        isTestMode: false
      });
    }

    // High-Fidelity Simulation Mode when custom credentials are not provided
    const simulatedOrderId = `order_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
    return res.json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: "INR",
      receipt: orderReceipt,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_elysian_luxury",
      isTestMode: true,
      notes
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ error: "Failed to create Razorpay payment order", details: error?.message });
  }
});

// 8. Razorpay Payment Verification Endpoint
app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest("hex");

      const isSignatureValid = generatedSignature === razorpay_signature;
      if (!isSignatureValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid Razorpay payment signature verification failed"
        });
      }

      return res.json({
        success: true,
        verified: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        timestamp: new Date().toISOString(),
        escrowReference: `ESC-${Date.now().toString().slice(-6)}`
      });
    }

    // If running in test / simulation mode
    return res.json({
      success: true,
      verified: true,
      orderId: razorpay_order_id || `order_test_${Date.now()}`,
      paymentId: razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 12)}`,
      timestamp: new Date().toISOString(),
      escrowReference: `ESC-${Date.now().toString().slice(-6)}`,
      simulation: !secret
    });
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({ error: "Payment verification failed", details: error?.message });
  }
});

// Mount Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Elysian Wedlock Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
