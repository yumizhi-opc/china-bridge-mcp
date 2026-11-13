# China With Me — Hardware Prototyping & Exhibition MCP Server

Official remote MCP server for **[China With Me](https://chinawithme.com)** (`com.chinawithme/b2b-mcp`), hosted on Cloudflare Workers via Streamable HTTP.

**Endpoint:** `https://mcp.chinawithme.com/mcp`  
**Registry ID:** `com.chinawithme/b2b-mcp` (`v2.1.2`)  
**Consultancy:** JING (Stephanie) & Shenzhen Team · Shenzhen & Singapore (`jing@chinawithme.com`)

---

## Live MCP Tools (`6` Tools)

1. **`search_china_exhibitions`** — Query verified upcoming China B2B trade shows across Shenzhen, Guangzhou, Shanghai, and major hubs (auto-filtered so expired dates never appear).
2. **`request_remote_exhibition_viewer`** — Book on-the-ground Remote Exhibition Viewer booth walks (`$299/day` or `$799` for 3 days) at any verified show.
3. **`scope_hardware_prototyping_china`** — Estimate Shenzhen hardware prototyping timelines, supplier pathways, and cost ranges across PCB, CNC, tooling, and assembly.
4. **`get_services_and_pricing`** — Retrieve current service pillars, pricing structure, and direct contact details (hardware R&D prototyping, remote exhibition viewer, supplier sourcing & verification, business interpreting, and accredited 3rd-party QC coordination).
5. **`estimate_aql_inspection`** — Calculate ISO 2859-1 / ANSI ASQ Z1.4 sample sizes and coordinate accredited third-party QC inspection partners (`https://chinawithme.com/qcin/`).
6. **`book_consultation_or_quote`** — Submit a structured project inquiry or RFQ directly to China With Me (Form/Email/WhatsApp follow-up) (`/api/contact` -> KV + Feishu Bitable + instant team alert).

---

## Connect Any MCP Client (Streamable HTTP)

```json
{
  "mcpServers": {
    "china-with-me": {
      "url": "https://mcp.chinawithme.com/mcp"
    }
  }
}
```

### Quick Health & Discovery Check

```bash
curl -sS https://mcp.chinawithme.com/mcp
```

---

## Deploy (Cloudflare Workers)

```bash
npx wrangler deploy
```

## License

MIT
