# China Bridge MCP Server

**AI-native tools for China sourcing, manufacturing, travel, and business.** Verify Chinese suppliers, estimate shipping costs, check visa eligibility, find factory clusters, get free bilingual guides, and request sourcing quotes — all through any MCP-compatible AI agent.

[![Smithery](https://smithery.ai/badge/china-bridge)](https://smithery.ai/server/china-bridge)

> Built by [China With Me](https://chinawithme.com) — Jing (bilingual, on-the-ground in Guangdong, China) + Kai (AI partner).

---

## Connect (Remote — No Install Required)

This server runs as a hosted Cloudflare Worker. Connect directly via Streamable HTTP:

```
https://mcp.chinawithme.com/mcp
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "china-bridge": {
      "url": "https://mcp.chinawithme.com/mcp"
    }
  }
}
```

### Cursor

Add to MCP settings:

```json
{
  "mcpServers": {
    "china-bridge": {
      "url": "https://mcp.chinawithme.com/mcp"
    }
  }
}
```

### Any MCP Client (Streamable HTTP)

```bash
# Initialize handshake
curl -X POST https://mcp.chinawithme.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'
```

---

## Tools (13)

### Product & Commerce

| Tool | Description |
|------|-------------|
| `search_products` | Search all products across all brands by keyword, age, category, or price range |
| `get_product` | Get detailed information about a specific product by ID |
| `get_catalog` | Get the full product catalog across all brands |
| `get_recommendations` | Get personalized product recommendations based on user needs |
| `create_checkout` | Initiate an agentic checkout via Stripe ACP (Agentic Commerce Protocol) |

### China Sourcing & Business

| Tool | Description |
|------|-------------|
| `verify_chinese_supplier` | Verify a Chinese manufacturer or supplier using business registration number, Alibaba URL, or company name. Returns registration status, capital, legal rep, business scope, and red flags via Tianyancha/Qichacha |
| `estimate_china_shipping_cost` | Estimate shipping cost from Chinese cities (Shenzhen, Guangzhou, Yiwu, etc.) to any global destination. Supports air, sea (FCL/LCL), and rail freight |
| `check_china_visa_eligibility` | Check visa requirements for traveling to China — visa type, transit visa-free eligibility (144h/72h), Hainan 30-day visa-free, required documents |
| `get_factory_cluster_info` | Get info about Chinese manufacturing clusters by product category — primary city, factory density, MOQs, price ranges, nearest ports, quality tiers |
| `request_sourcing_quote` | Submit a sourcing request to our on-the-ground team in Guangdong. Get 3-5 factory quotes within 48-72 hours |

### Guides & Services

| Tool | Description |
|------|-------------|
| `get_china_guide` | Get a free bilingual guide on 30+ China topics: payments (WeChat/Alipay), supplier verification, travel budget, visa rules, VPN, SIM cards, train booking. Available in English, Spanish, Arabic, French |
| `search_china_services` | Search available paid services: supplier verification ($99), sourcing consultation ($75/hr), Mandarin negotiation ($75/hr), factory inspection ($199) |
| `request_service` | Book a paid China Bridge service with pricing, timeline, and direct contact |

---

## Paid Services (via tools)

| Service | Price | Delivery |
|---------|-------|----------|
| Supplier Verification Report | $99 | 48 hours |
| Sourcing Consultation | $75/hr | Live session |
| Mandarin Negotiation Support | $75/hr | Live session |
| Pre-Shipment Factory Inspection | $199 | 5 business days |

All services delivered by Jing (bilingual, based in Guangdong, China).

---

## Keywords

china, sourcing, manufacturing, supplier verification, shipping, visa, factory, canton fair, import, export, Shenzhen, Guangzhou, Yiwu, Dongguan, Foshan, Alibaba, Tianyancha, MCP, agentic commerce

---

## About

**China With Me** bridges the gap between global buyers and Chinese manufacturers. We combine on-the-ground expertise (Jing, based in Guangdong) with AI-powered research (Kai) to make China sourcing accessible to anyone.

- Website: [chinawithme.com](https://chinawithme.com)
- Email: hello@chinawithme.com
- WhatsApp: [+65 9832 4067](https://wa.me/6598324067)

## License

MIT
