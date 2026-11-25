# Shenzhen Hardware EVT -> DVT DFM & Bring-Up Checklist

Open-source working checklist used by China With Me during on-the-ground Bao'an, Shajing, and Songgang prototyping sprints.

See the full redacted deliverable format: https://chinawithme.com/samples/evt-dvt-build-report

## Gate 1: IP & Legal Isolation (Before File Release)
- [ ] Bilingual PRC-enforceable **NNN Agreement** executed under Shenzhen court jurisdiction (non-disclosure, non-use, non-circumvention).
- [ ] Separate Gerber/PCBA assembly partner from mechanical CNC/injection-mold toolmaker so no single vendor holds full turnkey BOM + tooling + firmware.
- [ ] Tooling asset tags and serial numbers written directly into client-to-factory PO.

## Gate 2: BOM & Component Lead-Time Scrub (Huaqiangbei / LCSC / Authorized Disti)
- [ ] Flag single-source semiconductors, PMICs, RF transceivers, and connectors with >6-week factory lead time.
- [ ] Identify pin-compatible alternatives available in Shenzhen/HK authorized stock (DigiKey/Mouser/LCSC/Arrow).
- [ ] Lock moisture sensitivity level (MSL) handling and X-ray BGA inspection requirements with the SMT house.

## Gate 3: PCB & PCBA Pre-Fab DFM Checks (EVT, 5–25 Units)
- [ ] Confirm impedance control stackup rules for Wi-Fi / BLE / cellular / high-speed MIPI traces.
- [ ] Verify USB-C, JTAG/SWD debug header footprint clearance and solder mask dams on fine-pitch LQFP/QFN/BGA pads.
- [ ] Verify multi-rail power sequencing and soft-start RC delays before powering high-value SoC/NPU batches.
- [ ] Schedule thermal camera soak and standby current pull check on assembled first articles.

## Gate 4: Mechanical Enclosure & Mold DFM (CNC Bridge -> P20 / H13 Tooling)
- [ ] Keep EVT fit/thermal verification on CNC 6061 aluminum / SLS nylon before cutting hard steel tooling.
- [ ] Validate draft angles (>=1.0–1.5 degrees on textured walls), uniform wall thickness to avoid sink marks, and brass heat-set insert torque boss dimensions.
- [ ] Require raw T1/T2 sample photos with caliper checks and embossed mold serial tag verification before releasing mold completion milestone.

## Gate 5: DVT Integration & Pre-Compliance (25–100 Units)
- [ ] Execute enclosure IP65/IP67 gasket compression and 1.0–1.2m drop sequence across sample cartons.
- [ ] Run near-field EMI / ESD pre-scan in Bao'an test chambers before booking accredited FCC/CE/UL lab slots.
- [ ] Seal 3 signed Golden Samples (1 retained by factory line, 1 held for QC inspector, 1 shipped to client engineering lead).

## Gate 6: PVT Handover & Direct-Invoice Audit
- [ ] Confirm all POs, NRE invoices, and production deposits flow directly to the factory's GSXT-verified mainland RMB/USD corporate bank account (0% hidden agency kickbacks).
- [ ] Export complete step-by-step SOP, test jig schematics, and golden-unit firmware checksum to client repository.
