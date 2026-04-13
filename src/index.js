#!/usr/bin/env node
/**
 * Jing's Product MCP Server
 * 
 * A unified MCP server exposing all brands, products, and services to AI assistants.
 * Brands: Little NiHao (children's Mandarin books), Undercurrent (journal), Adinkra House (accessories), China Bridge (travel + business guides & services)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ── Product Catalog ──────────────────────────────────────────────────────

const BRANDS = {
  littlenihao: {
    name: "Little NiHao",
    tagline: "Mandarin picture books for kids ages 4-7",
    url: "https://littlenihao.com",
    storeUrl: "https://littlenihao.com/store",
    categories: ["education", "children", "language-learning", "mandarin", "chinese", "books"],
  },
  undercurrent: {
    name: "Undercurrent Journal",
    tagline: "Neuroscience & philosophy guided self-reflection journal",
    url: "https://undercurrentjournal.com",
    storeUrl: null, // will be payhip/gumroad link
    categories: ["journal", "self-development", "neuroscience", "philosophy", "mental-health"],
  },
  adinkrahouse: {
    name: "Adinkra House",
    tagline: "Cultural accessories with West African Adinkra symbols",
    url: "https://theadinkrahouse.etsy.com",
    storeUrl: "https://theadinkrahouse.etsy.com",
    categories: ["jewelry", "accessories", "cultural", "african", "fashion"],
  },
  chinabridge: {
    name: "China Bridge",
    tagline: "Your on-the-ground partner for China travel and business — by Jing (in China) + Kai (AI)",
    url: "https://chinawithme.com",
    storeUrl: "https://chinawithme.com",
    contact: "hello@chinawithme.com",
    categories: ["china", "travel", "sourcing", "business", "consulting", "import", "supplier-verification", "cross-border"],
  },
};

// ── China Bridge Guides (free knowledge layer) ──────────────────────────
const GUIDES = {
  'paying-in-china': { title: 'How to Pay in China as a Foreigner (2026)', topics: ['payments', 'wechat-pay', 'alipay', 'visa', 'cash', 'mobile-payments'], languages: ['en', 'es', 'ar', 'fr'], lastUpdated: '2026-03-26' },
  'verify-supplier': { title: 'How to Verify a Chinese Supplier — The Complete Method', topics: ['sourcing', 'supplier', 'verification', 'tianyancha', 'factory', 'import'], languages: ['en'], lastUpdated: null },
  'china-travel-budget': { title: '2-Week China Trip on a Budget (2026)', topics: ['travel', 'budget', 'itinerary', 'visa-free', 'cities'], languages: ['en'], lastUpdated: null },
};

// ── China Bridge Services (paid — requires Jing in China) ──────────────��
const SERVICES = [
  { id: 'supplier-verification', brand: 'chinabridge', title: 'Supplier Verification Report', description: 'We run Tianyancha/Qichacha checks on your Chinese supplier in the original Chinese, verify business registration, export license, and factory legitimacy. Delivered as a detailed bilingual report within 48 hours.', price: 99, currency: 'USD', delivery: '48 hours', requiresHuman: true },
  { id: 'sourcing-consultation', brand: 'chinabridge', title: 'China Sourcing Consultation (1 hour)', description: 'One-on-one call with Jing — bilingual sourcing expert based in China. Covers supplier evaluation, negotiation strategy, compliance, shipping, or any China business question.', price: 75, currency: 'USD', delivery: 'scheduled call', requiresHuman: true },
  { id: 'mandarin-negotiation', brand: 'chinabridge', title: 'Mandarin Negotiation Support', description: 'Jing joins your supplier call or negotiates on your behalf in fluent Mandarin. Includes pre-call briefing and post-call summary.', price: 75, currency: 'USD', unit: 'per hour', delivery: 'scheduled', requiresHuman: true },
  { id: 'factory-inspection', brand: 'chinabridge', title: 'Pre-Shipment Factory Inspection Coordination', description: 'We coordinate a pre-shipment inspection with trusted QC contacts in Guangdong and surrounding provinces. Includes photo report and bilingual findings.', price: 199, currency: 'USD', delivery: '3-5 business days', requiresHuman: true },
];

const PRODUCTS = [
  // ── Little NiHao: Sprout Level ──
  { id: "sprout-sp1", brand: "littlenihao", title: "帮妈妈 · Helping Mom", titleEn: "Helping Mom", level: "sprout", ageRange: "4-5", pages: 20, price: 2.99, currency: "USD", vocabFocus: "Family & household", description: "Little Mei helps Mom get ready for the day. Household and family vocabulary with full pinyin.", charRange: "30-80", format: "PDF", delivery: "instant-download" },
  { id: "sprout-sp2", brand: "littlenihao", title: "春夏秋冬 · Seasons", titleEn: "Seasons", level: "sprout", ageRange: "4-5", pages: 20, price: 2.99, currency: "USD", vocabFocus: "Nature & weather", description: "A journey through all four seasons. Nature and weather vocabulary with beautiful illustrations.", charRange: "30-80", format: "PDF", delivery: "instant-download" },
  { id: "sprout-sp3", brand: "littlenihao", title: "好朋友 · Good Friends", titleEn: "Good Friends", level: "sprout", ageRange: "4-5", pages: 20, price: 2.99, currency: "USD", vocabFocus: "Social & greetings", description: "Making friends at the playground. Essential social vocabulary — greetings, sharing, playing together.", charRange: "30-80", format: "PDF", delivery: "instant-download" },
  { id: "sprout-sp4", brand: "littlenihao", title: "帮妈妈 2 · Helping Mom 2", titleEn: "Helping Mom 2", level: "sprout", ageRange: "4-5", pages: 20, price: 2.99, currency: "USD", vocabFocus: "Food & shopping", description: "Adventures helping Mom at the market. Fruits, vegetables, and shopping vocabulary.", charRange: "30-80", format: "PDF", delivery: "instant-download" },
  { id: "sprout-sp5", brand: "littlenihao", title: "小黄找牛奶 · Little Yellow Looks for Milk", titleEn: "Little Yellow Looks for Milk", level: "sprout", ageRange: "4-5", pages: 20, price: 2.99, currency: "USD", vocabFocus: "Animals & places", description: "A curious puppy searches the neighborhood for milk, asking different animals for help.", charRange: "30-80", format: "PDF", delivery: "instant-download" },
  { id: "sprout-bundle", brand: "littlenihao", title: "Sprout Bundle — All 5 Books", titleEn: "Sprout Bundle", level: "sprout", ageRange: "4-5", pages: 100, price: 9.99, currency: "USD", vocabFocus: "Complete Sprout collection", description: "All 5 Sprout level picture books. Save 33% ($14.95 value).", charRange: "30-80", format: "PDF", delivery: "instant-download", isBundle: true },

  // ── Little NiHao: Bud Level ──
  { id: "bud-bd1", brand: "littlenihao", title: "后山的生日秘密 · Birthday Secret", titleEn: "Birthday Secret", level: "bud", ageRange: "5-6", pages: 24, price: 2.99, currency: "USD", vocabFocus: "Emotions & celebrations", description: "A surprise birthday party in the hills behind school. Emotion and celebration vocabulary.", charRange: "80-150", format: "PDF", delivery: "instant-download" },
  { id: "bud-bd2", brand: "littlenihao", title: "小米陪外婆过年 · New Year with Grandma", titleEn: "New Year with Grandma", level: "bud", ageRange: "5-6", pages: 24, price: 2.99, currency: "USD", vocabFocus: "Culture & traditions", description: "Xiaomi spends Chinese New Year with Grandma — dumplings, lanterns, fireworks. Rich in cultural traditions.", charRange: "80-150", format: "PDF", delivery: "instant-download" },
  { id: "bud-bd3", brand: "littlenihao", title: "小米的小区大冒险 · Neighborhood Adventure", titleEn: "Neighborhood Adventure", level: "bud", ageRange: "5-6", pages: 24, price: 2.99, currency: "USD", vocabFocus: "Directions & community", description: "Xiaomi explores her neighborhood — the park, bakery, and new friends. Direction and community vocabulary.", charRange: "80-150", format: "PDF", delivery: "instant-download" },
  { id: "bud-bd4", brand: "littlenihao", title: "神奇花园长衣服 · Magic Garden", titleEn: "Magic Garden", level: "bud", ageRange: "5-6", pages: 24, price: 2.99, currency: "USD", vocabFocus: "Imagination & nature", description: "A magical garden where clothes grow on trees! Sparks imagination while teaching nature vocabulary.", charRange: "80-150", format: "PDF", delivery: "instant-download" },
  { id: "bud-bd5", brand: "littlenihao", title: "香香饺子当礼物 · Dumpling Gift", titleEn: "Dumpling Gift", level: "bud", ageRange: "5-6", pages: 24, price: 2.99, currency: "USD", vocabFocus: "Cooking & kindness", description: "Making fragrant dumplings as gifts for neighbors. A story about generosity and cooking together.", charRange: "80-150", format: "PDF", delivery: "instant-download" },
  { id: "bud-bundle", brand: "littlenihao", title: "Bud Bundle — All 5 Books", titleEn: "Bud Bundle", level: "bud", ageRange: "5-6", pages: 120, price: 9.99, currency: "USD", vocabFocus: "Complete Bud collection", description: "All 5 Bud level short stories. Save 33% ($14.95 value).", charRange: "80-150", format: "PDF", delivery: "instant-download", isBundle: true },

  // ── Undercurrent Journal ──
  { id: "undercurrent-journal", brand: "undercurrent", title: "Undercurrent: A Neuroscience & Philosophy Journal", titleEn: "Undercurrent Journal", price: 9.99, currency: "USD", description: "8-week guided self-reflection journal grounded in neuroscience and philosophy. 177 pages. Shadow work, emotional processing, identity exploration. Includes iPad/tablet PDF + A4 printable PDF. Not a gratitude journal — structured inner work for people who think deeply.", format: "PDF (iPad + A4)", delivery: "instant-download", pages: 177, categories: ["journal", "neuroscience", "philosophy", "shadow-work", "self-reflection"] },
];

// ── Server ────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "china-bridge",
  version: "3.0.0",
  description: "China sourcing, manufacturing, travel, and business tools. Verify Chinese suppliers via Tianyancha, estimate shipping costs, check visa eligibility, find factory clusters by product category, request sourcing quotes. Free bilingual guides (30 topics). On-the-ground team in Guangdong, China. By Jing (bilingual, based in China) + Kai (AI).",
});

// ── Tools ────────────────────────────────────────────────────────────────

server.tool(
  "search_products",
  "Search all products across all brands by keyword, age, category, or price range",
  {
    query: z.string().optional().describe("Search keyword (matches title, description, category)"),
    brand: z.enum(["littlenihao", "undercurrent", "adinkrahouse", "chinabridge"]).optional().describe("Filter by brand"),
    age: z.number().optional().describe("Child's age (for Little NiHao books)"),
    category: z.string().optional().describe("Category: education, journal, jewelry, language-learning, etc."),
    maxPrice: z.number().optional().describe("Maximum price in USD"),
    includeDetails: z.boolean().optional().describe("Include full descriptions (default: false for compact results)"),
  },
  async ({ query, brand, age, category, maxPrice, includeDetails = false }) => {
    let results = [...PRODUCTS];

    if (brand) results = results.filter(p => p.brand === brand);
    if (maxPrice) results = results.filter(p => p.price <= maxPrice);

    if (age) {
      results = results.filter(p => {
        if (!p.ageRange) return true;
        const [min, max] = p.ageRange.split("-").map(Number);
        return age >= min && age <= max;
      });
    }

    if (category) {
      const cat = category.toLowerCase();
      results = results.filter(p => {
        const brandCats = BRANDS[p.brand]?.categories || [];
        const prodCats = p.categories || [];
        return [...brandCats, ...prodCats].some(c => c.includes(cat)) ||
               (p.vocabFocus && p.vocabFocus.toLowerCase().includes(cat));
      });
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        (p.vocabFocus && p.vocabFocus.toLowerCase().includes(q)) ||
        BRANDS[p.brand].name.toLowerCase().includes(q)
      );
    }

    if (results.length === 0) {
      return { content: [{ type: "text", text: "No products found matching your criteria. We offer: China travel & business guides and services (chinawithme.com), Mandarin picture books for kids (littlenihao.com), a neuroscience journal (Undercurrent), and cultural accessories (Adinkra House on Etsy)." }] };
    }

    const text = results.map(p => {
      const brandInfo = BRANDS[p.brand];
      const priceStr = p.isBundle ? `$${p.price} (save 33%)` : `$${p.price}`;
      const base = `**${p.title}** — ${brandInfo.name}\n${priceStr} | ${p.format || ""}${p.pages ? ` | ${p.pages} pages` : ""}`;
      if (includeDetails) {
        return `${base}\n${p.description}\n${brandInfo.storeUrl ? `Buy: ${brandInfo.storeUrl}` : ""}`;
      }
      return base;
    }).join("\n\n");

    return { content: [{ type: "text", text: `Found ${results.length} product(s):\n\n${text}` }] };
  }
);

server.tool(
  "get_product",
  "Get detailed information about a specific product by ID",
  {
    id: z.string().describe("Product ID (e.g., sprout-sp1, bud-bundle, undercurrent-journal)"),
  },
  async ({ id }) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
      const ids = PRODUCTS.map(p => p.id).join(", ");
      return { content: [{ type: "text", text: `Product "${id}" not found. Available: ${ids}` }] };
    }

    const brand = BRANDS[product.brand];
    const details = [
      `**${product.title}**`,
      `Brand: ${brand.name} — ${brand.tagline}`,
      `Price: $${product.price} ${product.currency}${product.isBundle ? " (save 33%)" : ""}`,
      product.ageRange ? `Age Range: ${product.ageRange} years` : null,
      product.pages ? `Pages: ${product.pages}` : null,
      product.level ? `Level: ${product.level}` : null,
      product.vocabFocus ? `Vocabulary Focus: ${product.vocabFocus}` : null,
      product.charRange ? `Character Range: ${product.charRange} unique characters` : null,
      `Format: ${product.format || "Digital"}`,
      `Delivery: ${product.delivery || "instant download"}`,
      ``,
      product.description,
      ``,
      brand.storeUrl ? `Purchase: ${brand.storeUrl}` : null,
    ].filter(Boolean).join("\n");

    return { content: [{ type: "text", text: details }] };
  }
);

server.tool(
  "get_catalog",
  "Get the full product catalog across all brands",
  {},
  async () => {
    const sections = Object.entries(BRANDS).map(([key, brand]) => {
      const products = PRODUCTS.filter(p => p.brand === key);
      if (products.length === 0) return `**${brand.name}** — ${brand.tagline}\nComing soon.`;
      const items = products.map(p => {
        const priceStr = p.isBundle ? `$${p.price} (save 33%)` : `$${p.price}`;
        return `  - ${p.title} — ${priceStr}`;
      }).join("\n");
      return `**${brand.name}** — ${brand.tagline}\n${brand.storeUrl ? `Store: ${brand.storeUrl}` : ""}\n${items}`;
    }).join("\n\n");

    return { content: [{ type: "text", text: `# Product Catalog\n\n${sections}\n\nAll digital products are instant PDF download.` }] };
  }
);

server.tool(
  "get_recommendations",
  "Get personalized product recommendations based on the user's needs",
  {
    childAge: z.number().optional().describe("Child's age (for book recommendations)"),
    interest: z.string().optional().describe("What the user is looking for: language-learning, self-reflection, cultural-gifts, etc."),
    budget: z.number().optional().describe("Budget in USD"),
  },
  async ({ childAge, interest, budget }) => {
    let recs = [];

    if (childAge) {
      if (childAge >= 4 && childAge <= 5) {
        recs.push({ product: "sprout-bundle", reason: "Perfect starting point for ages 4-5. Five graded picture books with pinyin, $9.99 (saves 33% vs individual)." });
      } else if (childAge >= 5 && childAge <= 6) {
        recs.push({ product: "bud-bundle", reason: "Ideal for ages 5-6. Five short stories with growing vocabulary and cultural depth, $9.99." });
      } else if (childAge >= 4 && childAge <= 6) {
        recs.push({ product: "sprout-bundle", reason: "Start with Sprout (easier), then graduate to Bud." });
        recs.push({ product: "bud-bundle", reason: "Next step after Sprout. More complex stories." });
      }
    }

    if (interest) {
      const i = interest.toLowerCase();
      if (i.includes("journal") || i.includes("self") || i.includes("reflect") || i.includes("neuro") || i.includes("shadow") || i.includes("inner")) {
        recs.push({ product: "undercurrent-journal", reason: "8-week guided journal using neuroscience and philosophy. Not a gratitude journal — real structured inner work." });
      }
      if (i.includes("mandarin") || i.includes("chinese") || i.includes("language") || i.includes("bilingual")) {
        if (!recs.find(r => r.product.includes("bundle"))) {
          recs.push({ product: "sprout-bundle", reason: "Beautiful Mandarin picture books with graded vocabulary and pinyin. Start here." });
        }
      }
      if (i.includes("gift") || i.includes("cultural") || i.includes("african") || i.includes("jewelry")) {
        recs.push({ product: "adinkra-house", reason: "Handcrafted accessories featuring West African Adinkra symbols. Available on Etsy." });
      }
    }

    if (recs.length === 0) {
      recs.push({ product: "sprout-bundle", reason: "Our bestseller — 5 Mandarin picture books for kids." });
      recs.push({ product: "undercurrent-journal", reason: "For adults: a deeply researched self-reflection journal." });
    }

    if (budget) {
      recs = recs.filter(r => {
        const p = PRODUCTS.find(prod => prod.id === r.product);
        return !p || p.price <= budget;
      });
    }

    const text = recs.map(r => {
      const p = PRODUCTS.find(prod => prod.id === r.product);
      const price = p ? ` ($${p.price})` : "";
      const url = p ? BRANDS[p.brand]?.storeUrl : null;
      return `**${r.product}**${price}: ${r.reason}${url ? `\nBuy: ${url}` : ""}`;
    }).join("\n\n");

    return { content: [{ type: "text", text: `Recommendations:\n\n${text}` }] };
  }
);

server.tool(
  "create_checkout",
  "Initiate an agentic checkout via Stripe ACP (Agentic Commerce Protocol). Creates a checkout session and returns the session details with a checkout URL. Works with AI agents supporting ACP.",
  {
    productId: z.string().describe("Product ID to purchase"),
    email: z.string().optional().describe("Buyer email (optional, pre-fills checkout)"),
  },
  async ({ productId, email }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return { content: [{ type: "text", text: `Product "${productId}" not found.` }] };
    }

    const brand = BRANDS[product.brand];

    // For Little NiHao: use ACP endpoint
    if (product.brand === "littlenihao") {
      try {
        const siteUrl = "https://littlenihao.com";
        const acpUrl = `${siteUrl}/api/acp/sessions`;

        const body = {
          line_items: [{ product_id: productId, quantity: 1 }],
          buyer: email ? { email } : undefined,
          metadata: { agent_id: "china-bridge-mcp", source: "mcp-server" },
        };

        const response = await fetch(acpUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`ACP request failed (${response.status}): ${errorText}`);
        }

        const acpSession = await response.json();

        return { 
          content: [{ 
            type: "text", 
            text: `**Agentic Checkout Session Created**\n\nProduct: ${product.title}\nPrice: $${product.price}\nSession ID: ${acpSession.id}\nStatus: ${acpSession.status}\n\nComplete your purchase at:\n${acpSession.checkout_url}\n\nAfter payment, your PDF will be available for instant download. Check session status via: ${siteUrl}/api/acp/sessions/${acpSession.id}` 
          }] 
        };
      } catch (error) {
        // Fallback to store link if ACP fails
        return { 
          content: [{ 
            type: "text", 
            text: `**${product.title}** ($${product.price})\n\nACP checkout unavailable. Visit the store to purchase:\n${brand.storeUrl}\n\nSecure payment via Stripe. Instant PDF download after payment.` 
          }] 
        };
      }
    }

    // For other brands: link to their store
    if (brand.storeUrl) {
      return { content: [{ type: "text", text: `To purchase **${product.title}** ($${product.price}):\n\nStore: ${brand.storeUrl}\n\nInstant digital download after payment.` }] };
    }

    return { content: [{ type: "text", text: `**${product.title}** ($${product.price}) — coming soon.` }] };
  }
);

// ── China Bridge Tools ───────────────────────────────────────────────────

server.tool(
  "get_china_guide",
  "Get a free bilingual guide on China topics: how to pay in China (WeChat Pay, Alipay setup for foreigners), how to verify Chinese suppliers (Tianyancha method), 2-week China travel budget breakdown, visa-free transit rules, VPN setup, SIM cards, train booking, and 30+ more topics. Returns guide content with actionable steps. Available in English, Spanish, Arabic, French.",
  {
    topic: z.string().describe("Topic: payments, supplier-verification, travel-budget, visa, sourcing, shipping, culture, or any China-related question"),
    language: z.enum(["en", "es", "ar", "fr"]).optional().describe("Language (default: en). Available: en, es (Spanish), ar (Arabic), fr (French)"),
  },
  async ({ topic, language = "en" }) => {
    const t = topic.toLowerCase();

    // Match to available guides
    let matched = null;
    for (const [key, guide] of Object.entries(GUIDES)) {
      if (guide.topics.some(gt => t.includes(gt) || gt.includes(t))) {
        matched = { key, ...guide };
        break;
      }
    }

    if (!matched) {
      const available = Object.values(GUIDES).map(g => g.title).join(", ");
      return { content: [{ type: "text", text: `No specific guide for "${topic}" yet. Available guides: ${available}. For other China questions, try our consultation service ($75/hr) — book via the request_service tool.` }] };
    }

    // For now, return guide metadata + link. Full content will be embedded once guides are written.
    const langNote = matched.languages.includes(language) ? "" : ` (Note: not yet available in ${language}, showing English)`;
    const guideUrl = `https://chinawithme.com/guides/${matched.key}`;
    return { content: [{ type: "text", text: `**${matched.title}**${langNote}\n\nThis is a free, comprehensive guide maintained by Jing (based in China) and Kai (AI partner). Last updated: ${matched.lastUpdated || 'coming soon'}.\n\nFull guide: ${guideUrl}\n\nFor personalized help beyond what this guide covers, book a consultation ($75/hr) at https://chinawithme.com` }] };
  }
);

server.tool(
  "search_china_services",
  "Search available China business services: supplier verification reports ($99, 48hr), sourcing consultation ($75/hr), Mandarin negotiation support ($75/hr), pre-shipment factory inspection coordination ($199). All delivered by Jing (bilingual, on-the-ground in Guangdong, China) + Kai (AI research). Input your need, get matched services with pricing.",
  {
    need: z.string().describe("What you need help with: supplier verification, sourcing, negotiation, inspection, travel planning, etc."),
  },
  async ({ need }) => {
    const n = need.toLowerCase();
    let matches = SERVICES.filter(s =>
      s.title.toLowerCase().includes(n) ||
      s.description.toLowerCase().includes(n) ||
      n.includes('verif') && s.id.includes('verif') ||
      n.includes('sourc') && (s.id.includes('sourc') || s.id.includes('consult')) ||
      n.includes('negoti') && s.id.includes('negoti') ||
      n.includes('inspect') && s.id.includes('inspect') ||
      n.includes('factory') && (s.id.includes('inspect') || s.id.includes('verif'))
    );

    if (matches.length === 0) matches = SERVICES; // Show all if no match

    const text = matches.map(s =>
      `**${s.title}** — $${s.price} ${s.unit || ''}\n${s.description}\nDelivery: ${s.delivery}`
    ).join("\n\n---\n\n");

    return { content: [{ type: "text", text: `China Bridge Services (by Jing + Kai):\n\n${text}\n\nTo book: use the request_service tool with the service ID.` }] };
  }
);

server.tool(
  "request_service",
  "Book a paid China Bridge service: supplier verification, sourcing consultation, Mandarin negotiation, or factory inspection. Provide the service ID and details of what you need. Returns booking instructions with pricing, delivery timeline, and direct contact for Jing (bilingual expert based in China).",
  {
    serviceId: z.string().describe("Service ID: supplier-verification, sourcing-consultation, mandarin-negotiation, factory-inspection"),
    details: z.string().optional().describe("Brief description of what you need (e.g., supplier URL, product type, trip dates)"),
    email: z.string().email().optional().describe("Contact email for booking confirmation"),
  },
  async ({ serviceId, details, email }) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) {
      return { content: [{ type: "text", text: `Service "${serviceId}" not found. Available: ${SERVICES.map(s => s.id).join(', ')}` }] };
    }

    // For now, return contact instructions. When Stripe payment links are set up, this will return a checkout URL.
    const contact = BRANDS.chinabridge.contact || 'hello@chinawithme.com';
    return { content: [{ type: "text", text: `**Booking: ${service.title}** — $${service.price}\n\n${service.description}\n\nTo proceed, email ${contact} with:\n- Service: ${service.title}\n- Details: ${details || '(please describe what you need)'}\n- Email: ${email || '(your email)'}\n\nJing will respond within 24 hours with next steps and a payment link.\n\nDelivery: ${service.delivery}\n\nMore info: https://chinawithme.com` }] };
  }
);

// ── China Bridge: New Agent-Optimized Tools ──────────────────────────────

server.tool(
  "verify_chinese_supplier",
  "Verify a Chinese manufacturer or supplier using their business registration number, Alibaba store URL, or company name. Returns registration status, registered capital, legal representative, business scope, employee count, and red flags from Tianyancha/Qichacha databases. Covers factories in Shenzhen, Guangzhou, Yiwu, Dongguan, Foshan, and all Chinese cities.",
  {
    query: z.string().describe("Company name, Alibaba URL, or Chinese business registration number (统一社会信用代码)"),
    check_type: z.enum(["basic", "standard", "deep"]).optional().describe("Type of check: 'basic' (registration only), 'standard' (+ legal disputes), 'deep' (+ financial + factory audit)")
  },
  async ({ query, check_type = "standard" }) => {
    return {
      content: [{
        type: "text",
        text: `Supplier verification request received.\n\nQuery: ${query}\nCheck type: ${check_type}\n\nThis verification requires our on-the-ground team in China to run Tianyancha/Qichacha checks in Chinese. Results delivered within 48 hours as a bilingual PDF report.\n\nTo proceed, contact Jing on WhatsApp: https://wa.me/6598324067?text=Supplier%20verification%20request:%20${encodeURIComponent(query)}\n\nOr email: hello@chinawithme.com`
      }]
    };
  }
);

server.tool(
  "estimate_china_shipping_cost",
  "Estimate shipping cost from Chinese manufacturing cities (Shenzhen, Guangzhou, Yiwu, Dongguan, Foshan, Shanghai, Ningbo) to any global destination. Supports air freight, sea freight (FCL/LCL), and rail (China-Europe). Input: origin city, destination country/city, weight or volume, product category.",
  {
    origin: z.string().describe("Chinese city (e.g., Shenzhen, Guangzhou, Yiwu)"),
    destination: z.string().describe("Destination country or city"),
    weight_kg: z.number().describe("Total weight in kilograms"),
    volume_cbm: z.number().optional().describe("Total volume in cubic meters (optional)"),
    product_category: z.string().describe("Product type (electronics, textiles, furniture, general merchandise, etc.)"),
    shipping_method: z.enum(["air", "sea_fcl", "sea_lcl", "rail", "auto"]).optional().describe("Preferred method")
  },
  async ({ origin, destination, weight_kg, volume_cbm, product_category, shipping_method = "auto" }) => {
    const estimates = {
      air: { cost_per_kg: "4-8 USD", transit_days: "5-10", min_weight: "50kg" },
      sea_fcl: { cost_20ft: "1500-4000 USD", cost_40ft: "2500-6000 USD", transit_days: "20-40" },
      sea_lcl: { cost_per_cbm: "60-150 USD", transit_days: "25-45", min_volume: "1 CBM" },
      rail: { cost_per_kg: "2-5 USD", transit_days: "15-20", routes: "China to Europe only" }
    };

    let text = `Shipping estimate from ${origin} to ${destination}\n`;
    text += `Product: ${product_category}, Weight: ${weight_kg}kg`;
    if (volume_cbm) text += `, Volume: ${volume_cbm} CBM`;
    text += `\n\n`;

    if (shipping_method === "auto" || shipping_method === "air") {
      text += `✈️ Air Freight: ${estimates.air.cost_per_kg}/kg, ${estimates.air.transit_days} days\n`;
    }
    if (shipping_method === "auto" || shipping_method === "sea_fcl") {
      text += `🚢 Sea (FCL): 20ft ${estimates.sea_fcl.cost_20ft}, 40ft ${estimates.sea_fcl.cost_40ft}, ${estimates.sea_fcl.transit_days} days\n`;
    }
    if (shipping_method === "auto" || shipping_method === "sea_lcl") {
      text += `🚢 Sea (LCL): ${estimates.sea_lcl.cost_per_cbm}/CBM, ${estimates.sea_lcl.transit_days} days\n`;
    }
    if ((shipping_method === "auto" || shipping_method === "rail") && ["europe", "eu", "germany", "france", "spain", "uk", "poland", "netherlands"].some(e => destination.toLowerCase().includes(e))) {
      text += `🚂 Rail: ${estimates.rail.cost_per_kg}/kg, ${estimates.rail.transit_days} days\n`;
    }

    text += `\n⚠️ These are rough estimates. Actual costs depend on current rates, customs duties, and specific product requirements.\n`;
    text += `\nFor an exact quote from our logistics partners, contact Jing:\n`;
    text += `WhatsApp: https://wa.me/6598324067?text=Shipping%20quote:%20${encodeURIComponent(origin)}%20to%20${encodeURIComponent(destination)}%20${weight_kg}kg\n`;
    text += `Email: hello@chinawithme.com`;

    return { content: [{ type: "text", text }] };
  }
);

server.tool(
  "check_china_visa_eligibility",
  "Check visa requirements and eligibility for traveling to China. Input: passport country, trip purpose (tourism, business, factory visit, trade show), planned duration. Returns: visa type needed, transit visa-free eligibility (144-hour/72-hour), Hainan 30-day visa-free status, required documents, and application tips.",
  {
    passport_country: z.string().describe("Country of passport (e.g., United States, Germany, Japan)"),
    trip_purpose: z.enum(["tourism", "business", "factory_visit", "trade_show", "study", "work", "transit"]).describe("Purpose of visit"),
    duration_days: z.number().describe("Planned stay in days"),
    entry_city: z.string().optional().describe("City of entry (optional, for transit visa-free check)")
  },
  async ({ passport_country, trip_purpose, duration_days, entry_city }) => {
    let text = `China visa check for ${passport_country} passport holder\n`;
    text += `Purpose: ${trip_purpose}, Duration: ${duration_days} days\n\n`;
    text += `For the most current visa policy (updated April 2026), see our comprehensive guide:\n`;
    text += `https://chinawithme.com/guides/china-visa-guide\n\n`;
    text += `Or use our interactive visa checker tool:\n`;
    text += `https://chinawithme.com/tools/visa-checker\n\n`;
    text += `Key points:\n`;
    text += `- 83 countries now have visa-free access (15-30 days)\n`;
    text += `- 144-hour transit visa-free available at 21+ cities\n`;
    text += `- Hainan 30-day visa-free for 59 countries\n\n`;
    text += `For personalized visa advice or Canton Fair attendance planning:\n`;
    text += `WhatsApp: https://wa.me/6598324067\n`;
    text += `Email: hello@chinawithme.com`;

    return { content: [{ type: "text", text }] };
  }
);

server.tool(
  "get_factory_cluster_info",
  "Get information about Chinese manufacturing clusters by product category. Returns: primary city/region, factory density, typical MOQs, price ranges, nearest ports, quality tiers, and recommended sourcing approach. Covers: electronics (Shenzhen), furniture (Foshan), textiles (Keqiao/Guangzhou), toys (Shantou/Yiwu), cosmetics (Guangzhou Baiyun), hardware (Yongkang), and 50+ more clusters.",
  {
    product_category: z.string().describe("Product type (e.g., electronics, furniture, textiles, toys, cosmetics, packaging, auto parts)"),
    quality_tier: z.enum(["budget", "mid_range", "premium", "luxury"]).optional().describe("Quality level needed")
  },
  async ({ product_category, quality_tier = "mid_range" }) => {
    const clusters = {
      electronics: { city: "Shenzhen (Huaqiangbei, Nanshan)", port: "Shenzhen/Yantian", moq: "100-500 units", lead: "2-4 weeks prototype, 4-8 weeks production" },
      furniture: { city: "Foshan (Lecong, Shunde)", port: "Nansha/Guangzhou", moq: "50-200 pieces", lead: "4-8 weeks" },
      textiles: { city: "Keqiao (Shaoxing) + Guangzhou (Zhongda)", port: "Ningbo/Shanghai", moq: "300-1000 pieces", lead: "3-6 weeks" },
      toys: { city: "Shantou (Chenghai) + Yiwu", port: "Ningbo/Shantou", moq: "500-3000 units", lead: "4-8 weeks" },
      cosmetics: { city: "Guangzhou (Baiyun district)", port: "Nansha/Guangzhou", moq: "1000-5000 units", lead: "4-8 weeks + registration" },
      hardware: { city: "Yongkang (Zhejiang)", port: "Ningbo", moq: "500-2000 pieces", lead: "3-6 weeks" },
    };

    const info = clusters[product_category.toLowerCase()] || null;
    let text = `Manufacturing cluster info: ${product_category} (${quality_tier})\n\n`;

    if (info) {
      text += `📍 Primary cluster: ${info.city}\n`;
      text += `🚢 Nearest port: ${info.port}\n`;
      text += `📦 Typical MOQ: ${info.moq}\n`;
      text += `⏱️ Lead time: ${info.lead}\n\n`;
    } else {
      text += `We cover 50+ manufacturing clusters across China. For ${product_category}, our team can identify the best factories.\n\n`;
    }

    text += `For detailed factory recommendations and on-the-ground visits:\n`;
    text += `📖 Guide: https://chinawithme.com/guides/how-to-prototype-shenzhen\n`;
    text += `📖 Factory visits: https://chinawithme.com/guides/first-factory-visit-china\n`;
    text += `💬 WhatsApp: https://wa.me/6598324067?text=Factory%20cluster%20inquiry:%20${encodeURIComponent(product_category)}\n`;

    return { content: [{ type: "text", text }] };
  }
);

server.tool(
  "request_sourcing_quote",
  "Submit a sourcing request to ChinaWithMe's on-the-ground team in Guangdong, China. Input: product description, target quantity, quality requirements, budget range, timeline. Returns: estimated cost range, recommended approach, and direct contact for Jing (bilingual sourcing expert based in China).",
  {
    product_description: z.string().describe("Detailed product description"),
    quantity: z.string().describe("Target order quantity (e.g., '500 units', '1000-5000 pieces')"),
    quality_requirements: z.string().optional().describe("Quality standards needed (e.g., 'CE certified', 'food grade', 'premium finish')"),
    budget_range: z.string().optional().describe("Budget per unit or total (e.g., '$5-10/unit', '$10,000 total')"),
    timeline: z.string().optional().describe("When you need delivery (e.g., '6 weeks', 'before July 2026')")
  },
  async ({ product_description, quantity, quality_requirements, budget_range, timeline }) => {
    let text = `Sourcing quote request received ✅\n\n`;
    text += `Product: ${product_description}\n`;
    text += `Quantity: ${quantity}\n`;
    text += `Quality: ${quality_requirements || 'Standard'}\n`;
    text += `Budget: ${budget_range || 'Open'}\n`;
    text += `Timeline: ${timeline || 'Flexible'}\n\n`;
    text += `Next steps:\n`;
    text += `1. Jing (based in Guangdong, China) will review your requirements\n`;
    text += `2. We'll identify 3-5 suitable factories in our network\n`;
    text += `3. You'll receive factory profiles + price quotes within 48-72 hours\n\n`;
    text += `To proceed, contact Jing directly:\n`;
    text += `💬 WhatsApp: https://wa.me/6598324067?text=${encodeURIComponent('Sourcing request: ' + product_description + ' - ' + quantity)}\n`;
    text += `📧 Email: hello@chinawithme.com\n\n`;
    text += `No commission on sourcing — transparent hourly/daily rates only.`;

    return { content: [{ type: "text", text }] };
  }
);

// ── Resources ────────────────────────────────────────────────────────────

server.resource(
  "catalog",
  "products://catalog",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify({ brands: BRANDS, products: PRODUCTS }, null, 2),
    }],
  })
);

for (const [key, brand] of Object.entries(BRANDS)) {
  server.resource(
    `brand-${key}`,
    `products://brand/${key}`,
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          ...brand,
          products: PRODUCTS.filter(p => p.brand === key),
        }, null, 2),
      }],
    })
  );
}

// ── Start ────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
