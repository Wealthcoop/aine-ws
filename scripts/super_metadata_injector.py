#!/usr/bin/env python3
"""
Aine (AINE.ws) Super-Metadata Injection Engine
---------------------------------------------
Injects comprehensive multi-tier metadata across:
1. JPEGs: 32-Field EXIF (0th, Exif, GPS), Binary IPTC-IIM (APP13), and Adobe XMP (APP1).
2. PNGs: Standard tEXt/iTXt chunks and Adobe XMP packet.
3. SVGs: RDF / Dublin Core XML metadata block.
4. PDFs: Embedded /Info dictionary with Title, Author, Subject, Keywords, Creator, Producer.

Architected for triple-tier visibility:
- Global / International: Applied AI, GEO, LLM retrieval, Voice AI telephony, Autonomous agents.
- National: US regulatory frameworks, enterprise search benchmarks, commercial software.
- Regional / Local: Verifiable Folsom CA / Sacramento Valley headquarters anchor for E-E-A-T.
"""

import sys
import os
import re
import json
import struct
from datetime import datetime
from PIL import Image, ImageOps, ImageEnhance, PngImagePlugin
import piexif

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(WORKSPACE_ROOT, "public")

# Organization and Bureau Coordinates (Folsom Headquarters)
HEADQUARTERS = {
    "name": "Aine (AINE.ws)",
    "legal_name": "Aine Applied Intelligence Wire",
    "founder": "Justin Davis",
    "founder_role": "Founder & Lead Search Analyst",
    "url": "https://aine.ws",
    "street": "705 Gold Lake Dr, Suite 250",
    "city": "Folsom",
    "state": "California",
    "state_abbr": "CA",
    "postal_code": "95630",
    "country": "United States",
    "country_code": "USA",
    "cid_url": "https://maps.google.com/?cid=7895656689241912038",
    "phone": "(916) 234-3457",
    "email": "editorial@aine.ws",
    "lat": 38.6778144,
    "lon": -121.1792115,
    "altitude_m": 67.0
}

GLOBAL_KEYWORDS = [
    "Aine",
    "AINE.ws",
    "Applied AI",
    "Generative Engine Optimization",
    "GEO",
    "Search & AI Overviews",
    "Voice AI Telephony",
    "Inbound Lead Response Automation",
    "Google Maps 3-Pack Algorithms",
    "Google Business Profile Optimization",
    "Autonomous Agent Architecture",
    "Empirical Search Telemetry",
    "Justin Davis",
    "United States",
    "California Tech Corridor",
    "Sacramento Valley",
    "Folsom CA"
]

def decimal_to_dms_rational(deg_float):
    val = abs(deg_float)
    deg = int(val)
    rem = (val - deg) * 60.0
    minute = int(rem)
    sec = (rem - minute) * 60.0
    sec_rational = (int(round(sec * 1000)), 1000)
    return [(deg, 1), (minute, 1), sec_rational]

def _xml_escape(val):
    if not val:
        return ""
    return (
        str(val)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )

def build_xmp_packet(title, description, keywords, companion_url=None):
    kw_lis = "".join(f"<rdf:li>{_xml_escape(kw.strip())}</rdf:li>" for kw in keywords if kw.strip())
    now_iso = datetime.now().isoformat()
    title_esc = _xml_escape(title)
    desc_esc = _xml_escape(description)
    comp_url_esc = _xml_escape(companion_url or "https://aine.ws/reports/ainews-wire-publication-entity-protocol.pdf")

    xmp = f"""<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Aine Multi-Tier Global Entity Engine 3.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:tiff="http://ns.adobe.com/tiff/1.0/"
    xmlns:exif="http://ns.adobe.com/exif/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    xmlns:plus="http://ns.useplus.org/ldf/xmp/1.0/"
    xmlns:schema="https://schema.org/">
   <xmp:Rating>5</xmp:Rating>
   <xmp:CreateDate>{now_iso}</xmp:CreateDate>
   <xmp:ModifyDate>{now_iso}</xmp:ModifyDate>
   <xmp:MetadataDate>{now_iso}</xmp:MetadataDate>
   <xmp:CreatorTool>Aine Editorial Verification Engine 3.0</xmp:CreatorTool>
   <dc:title>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">{title_esc}</rdf:li>
    </rdf:Alt>
   </dc:title>
   <dc:description>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">{desc_esc}</rdf:li>
    </rdf:Alt>
   </dc:description>
   <dc:creator>
    <rdf:Seq>
     <rdf:li>{HEADQUARTERS['founder']}, {HEADQUARTERS['founder_role']}</rdf:li>
     <rdf:li>{HEADQUARTERS['name']}</rdf:li>
    </rdf:Seq>
   </dc:creator>
   <dc:publisher>
    <rdf:Bag>
     <rdf:li>{HEADQUARTERS['legal_name']}</rdf:li>
    </rdf:Bag>
   </dc:publisher>
   <dc:rights>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">Copyright 2026 {HEADQUARTERS['legal_name']}. All rights reserved.</rdf:li>
    </rdf:Alt>
   </dc:rights>
   <dc:subject>
    <rdf:Bag>
     {kw_lis}
    </rdf:Bag>
   </dc:subject>
   <dc:identifier>https://aine.ws</dc:identifier>
   <photoshop:Headline>{title_esc}</photoshop:Headline>
   <photoshop:City>{HEADQUARTERS['city']}</photoshop:City>
   <photoshop:State>{HEADQUARTERS['state']}</photoshop:State>
   <photoshop:Country>{HEADQUARTERS['country']}</photoshop:Country>
   <photoshop:Credit>{HEADQUARTERS['name']}</photoshop:Credit>
   <photoshop:Source>{HEADQUARTERS['url']}</photoshop:Source>
   <photoshop:AuthorsPosition>{HEADQUARTERS['founder_role']}</photoshop:AuthorsPosition>
   <Iptc4xmpCore:Location>{HEADQUARTERS['city']}, {HEADQUARTERS['state_abbr']}, {HEADQUARTERS['country_code']}</Iptc4xmpCore:Location>
   <Iptc4xmpCore:CountryCode>{HEADQUARTERS['country_code']}</Iptc4xmpCore:CountryCode>
   <xmpRights:Marked>True</xmpRights:Marked>
   <xmpRights:WebStatement>https://aine.ws/standards</xmpRights:WebStatement>
   <schema:contentLocation>{HEADQUARTERS['city']}, {HEADQUARTERS['state_abbr']}</schema:contentLocation>
   <schema:companionDocument>{comp_url_esc}</schema:companionDocument>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>"""
    return xmp.encode('utf-8')

def build_iptc_iim(title, description, keywords):
    def iptc_dataset(record, dataset, data_bytes):
        return b"\x1c" + bytes([record, dataset]) + struct.pack(">H", len(data_bytes)) + data_bytes

    b = bytearray()
    b.extend(iptc_dataset(1, 90, b"\x1b%G")) # UTF-8 character set
    b.extend(iptc_dataset(2, 5, title[:64].encode('utf-8'))) # Object name
    b.extend(iptc_dataset(2, 105, title[:256].encode('utf-8'))) # Headline
    b.extend(iptc_dataset(2, 120, description[:2000].encode('utf-8'))) # Caption
    b.extend(iptc_dataset(2, 80, f"{HEADQUARTERS['founder']} (Aine)".encode('utf-8'))) # By-line
    b.extend(iptc_dataset(2, 85, HEADQUARTERS['founder_role'].encode('utf-8'))) # By-line title
    b.extend(iptc_dataset(2, 110, HEADQUARTERS['name'].encode('utf-8'))) # Credit
    b.extend(iptc_dataset(2, 115, HEADQUARTERS['url'].encode('utf-8'))) # Source
    b.extend(iptc_dataset(2, 116, f"Copyright 2026 {HEADQUARTERS['name']}".encode('utf-8'))) # Copyright
    b.extend(iptc_dataset(2, 90, HEADQUARTERS['city'].encode('utf-8'))) # City
    b.extend(iptc_dataset(2, 95, HEADQUARTERS['state'].encode('utf-8'))) # State
    b.extend(iptc_dataset(2, 101, HEADQUARTERS['country'].encode('utf-8'))) # Country

    for kw in keywords[:30]:
        kw_clean = kw.strip()
        if kw_clean:
            b.extend(iptc_dataset(2, 25, kw_clean[:64].encode('utf-8')))

    # Wrap in Photoshop 8BIM block
    iptc_bytes = bytes(b)
    bim_header = b"Photoshop 3.0\x008BIM\x04\x04\x00\x00" + struct.pack(">I", len(iptc_bytes))
    bim_payload = bim_header + iptc_bytes
    if len(iptc_bytes) % 2 == 1:
        bim_payload += b"\x00"
    marker_len = len(bim_payload) + 2
    return b"\xff\xed" + struct.pack(">H", marker_len) + bim_payload

def inject_jpeg(path, title, description, keywords, companion_url=None):
    if not os.path.exists(path):
        return False

    now_str = datetime.now().strftime("%Y:%m:%d %H:%M:%S")
    now_date = datetime.now().strftime("%Y:%m:%d")

    # 1. Build EXIF with piexif
    lat = HEADQUARTERS['lat']
    lon = HEADQUARTERS['lon']
    alt = HEADQUARTERS['altitude_m']

    gps_ifd = {
        piexif.GPSIFD.GPSVersionID: (2, 3, 0, 0),
        piexif.GPSIFD.GPSLatitudeRef: 'N' if lat >= 0 else 'S',
        piexif.GPSIFD.GPSLatitude: decimal_to_dms_rational(lat),
        piexif.GPSIFD.GPSLongitudeRef: 'E' if lon >= 0 else 'W',
        piexif.GPSIFD.GPSLongitude: decimal_to_dms_rational(lon),
        piexif.GPSIFD.GPSAltitudeRef: 0,
        piexif.GPSIFD.GPSAltitude: (int(alt), 1),
        piexif.GPSIFD.GPSMapDatum: b"WGS-84",
        piexif.GPSIFD.GPSAreaInformation: f"{HEADQUARTERS['city']}, {HEADQUARTERS['state']}, {HEADQUARTERS['country']}".encode('utf-8'),
        piexif.GPSIFD.GPSDateStamp: now_date.encode('utf-8')
    }

    user_comment_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "name": title,
        "caption": description,
        "author": {
            "@type": "Person",
            "name": HEADQUARTERS['founder'],
            "jobTitle": HEADQUARTERS['founder_role'],
            "url": "https://aine.ws/authors/justin-davis"
        },
        "publisher": {
            "@type": "NewsMediaOrganization",
            "name": HEADQUARTERS['name'],
            "url": HEADQUARTERS['url'],
            "logo": "https://aine.ws/logo-square-512.png"
        },
        "spatialCoverage": [
            {"@type": "Place", "name": "Global / International"},
            {"@type": "Country", "name": "United States"},
            {"@type": "Place", "name": f"{HEADQUARTERS['city']} Headquarters, {HEADQUARTERS['state']}", "geo": {"@type": "GeoCoordinates", "latitude": lat, "longitude": lon}}
        ],
        "keywords": keywords
    }, separators=(',', ':'))

    zeroth_ifd = {
        piexif.ImageIFD.Make: b"Aine Media & Telemetry Desk",
        piexif.ImageIFD.Model: b"Aine Editorial Radar 3.0",
        piexif.ImageIFD.Software: b"Aine Applied Intelligence Verification Engine",
        piexif.ImageIFD.Artist: f"{HEADQUARTERS['founder']} ({HEADQUARTERS['name']})".encode('utf-8'),
        piexif.ImageIFD.Copyright: f"Copyright 2026 {HEADQUARTERS['legal_name']}. All rights reserved.".encode('utf-8'),
        piexif.ImageIFD.ImageDescription: description.encode('utf-8'),
        piexif.ImageIFD.DateTime: now_str.encode('utf-8'),
        piexif.ImageIFD.XPTitle: title.encode('utf-16le'),
        piexif.ImageIFD.XPAuthor: HEADQUARTERS['founder'].encode('utf-16le'),
        piexif.ImageIFD.XPComment: description.encode('utf-16le'),
        piexif.ImageIFD.XPKeywords: "; ".join(keywords).encode('utf-16le'),
        piexif.ImageIFD.XPSubject: title.encode('utf-16le')
    }

    exif_ifd = {
        piexif.ExifIFD.DateTimeOriginal: now_str.encode('utf-8'),
        piexif.ExifIFD.DateTimeDigitized: now_str.encode('utf-8'),
        piexif.ExifIFD.UserComment: f"ASCII\x00\x00\x00{user_comment_json}".encode('utf-8')
    }

    exif_bytes = piexif.dump({"0th": zeroth_ifd, "Exif": exif_ifd, "GPS": gps_ifd})

    # Save image with piexif EXIF
    im = Image.open(path)
    im.save(path, "JPEG", quality=95, exif=exif_bytes, optimize=True)

    # 2. Inject Adobe XMP (APP1) and IPTC-IIM (APP13) raw binary markers
    xmp_bytes = build_xmp_packet(title, description, keywords, companion_url)
    iptc_bytes = build_iptc_iim(title, description, keywords)

    with open(path, "rb") as f:
        jpeg_data = f.read()

    # Strip any previous XMP or IPTC to avoid duplicate segments
    cleaned = bytearray()
    cleaned.extend(jpeg_data[:2]) # SOI (\xff\xd8)
    pos = 2
    while pos < len(jpeg_data) - 1:
        if jpeg_data[pos] == 0xff:
            marker = jpeg_data[pos + 1]
            if marker in (0xd9, 0xda): # EOI or SOS
                cleaned.extend(jpeg_data[pos:])
                break
            length = struct.unpack(">H", jpeg_data[pos + 2:pos + 4])[0]
            segment = jpeg_data[pos:pos + 2 + length]
            if marker == 0xe1 and segment[4:33] == b"http://ns.adobe.com/xap/1.0/\x00":
                pos += 2 + length
                continue
            if marker == 0xed and segment[4:18] == b"Photoshop 3.0\x00":
                pos += 2 + length
                continue
            cleaned.extend(segment)
            pos += 2 + length
        else:
            cleaned.append(jpeg_data[pos])
            pos += 1

    # Insert XMP and IPTC after SOI / APP0 / APP1
    insert_idx = 2
    if len(cleaned) > 4 and cleaned[2] == 0xff and cleaned[3] in (0xe0, 0xe1):
        seg_len = struct.unpack(">H", cleaned[4:6])[0]
        insert_idx = 4 + seg_len

    xmp_header = b"http://ns.adobe.com/xap/1.0/\x00"
    xmp_payload = xmp_header + xmp_bytes
    xmp_segment = b"\xff\xe1" + struct.pack(">H", len(xmp_payload) + 2) + xmp_payload

    final_jpeg = bytes(cleaned[:insert_idx]) + xmp_segment + iptc_bytes + bytes(cleaned[insert_idx:])
    with open(path, "wb") as f:
        f.write(final_jpeg)

    return True

def inject_png(path, title, description, keywords):
    if not os.path.exists(path):
        return False

    im = Image.open(path)
    meta = PngImagePlugin.PngInfo()

    meta.add_text("Title", title)
    meta.add_text("Author", f"{HEADQUARTERS['founder']} ({HEADQUARTERS['name']})")
    meta.add_text("Description", description)
    meta.add_text("Copyright", f"Copyright 2026 {HEADQUARTERS['legal_name']}. All rights reserved.")
    meta.add_text("Software", "Aine Media Processing & Verification Engine 3.0")
    meta.add_text("Source", HEADQUARTERS['url'])
    meta.add_text("Keywords", "; ".join(keywords))
    meta.add_text("URL", HEADQUARTERS['url'])

    # Embed Adobe XMP in XML:com.adobe.xmp chunk
    xmp_str = build_xmp_packet(title, description, keywords).decode('utf-8', errors='ignore')
    meta.add_text("XML:com.adobe.xmp", xmp_str)

    im.save(path, "PNG", pnginfo=meta, optimize=True)
    return True

def inject_svg(path, title, description, keywords):
    if not os.path.exists(path):
        return False

    with open(path, "r", encoding="utf-8") as f:
        svg_content = f.read()

    # Remove any existing metadata block
    svg_content = re.sub(r'<metadata>[\s\S]*?</metadata>', '', svg_content)

    kw_elements = "".join(f"<rdf:li>{_xml_escape(kw.strip())}</rdf:li>" for kw in keywords if kw.strip())

    meta_block = f"""  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/"
             xmlns:cc="http://creativecommons.org/ns#">
      <rdf:Description rdf:about="{HEADQUARTERS['url']}">
        <dc:title>{_xml_escape(title)}</dc:title>
        <dc:description>{_xml_escape(description)}</dc:description>
        <dc:creator>{HEADQUARTERS['founder']}</dc:creator>
        <dc:publisher>{HEADQUARTERS['legal_name']}</dc:publisher>
        <dc:rights>Copyright 2026 {HEADQUARTERS['legal_name']}. All rights reserved.</dc:rights>
        <dc:subject>
          <rdf:Bag>
            {kw_elements}
          </rdf:Bag>
        </dc:subject>
        <dc:date>{datetime.now().strftime('%Y-%m-%d')}</dc:date>
      </rdf:Description>
    </rdf:RDF>
  </metadata>"""

    # Insert after opening <svg ...>
    svg_tag_end = svg_content.find('>')
    if svg_tag_end != -1:
        svg_content = svg_content[:svg_tag_end + 1] + "\n" + meta_block + svg_content[svg_tag_end + 1:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_content)

    return True

def inject_pdf_metadata(pdf_path, title, keywords):
    if not os.path.exists(pdf_path):
        return False

    with open(pdf_path, "rb") as f:
        data = f.read()

    now_date = datetime.now().strftime("D:%Y%m%d%H%M%SZ")
    kw_str = ", ".join(keywords)

    # Clean escape for PDF string
    def pdf_str_escape(s):
        return s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    title_esc = pdf_str_escape(title)
    kw_esc = pdf_str_escape(kw_str)

    # Standard PDF trailer and info object update
    info_dict = f"""<<
  /Title ({title_esc})
  /Author (Justin Davis, Founder & Lead Search Analyst - Aine)
  /Subject (Applied AI, GEO & Algorithmic Search Telemetry Whitepaper)
  /Keywords ({kw_esc})
  /Creator (Aine Applied Intelligence Wire - https://aine.ws)
  /Producer (Aine Media & Telemetry Engine 3.0)
  /CreationDate ({now_date})
  /ModDate ({now_date})
>>"""

    # Look for last trailer
    last_trailer_pos = data.rfind(b"trailer")
    if last_trailer_pos == -1:
        return False

    # Extract Root reference from trailer
    trailer_block = data[last_trailer_pos:]
    root_match = re.search(rb'/Root\s+(\d+\s+\d+\s+R)', trailer_block)
    root_ref = root_match.group(1).decode('ascii') if root_match else "1 0 R"

    # Find highest object ID
    obj_matches = re.findall(rb'(\d+)\s+(\d+)\s+obj', data)
    highest_id = max([int(m[0]) for m in obj_matches]) if obj_matches else 100
    new_info_id = highest_id + 1

    file_len = len(data)
    info_obj = f"\n{new_info_id} 0 obj\n{info_dict}\nendobj\n"
    xref_offset = file_len + len(info_obj.encode('latin1'))

    new_xref = f"""xref
0 1
0000000000 65535 f 
{new_info_id} 1
{file_len:010d} 00000 n 
trailer
<<
  /Size {new_info_id + 1}
  /Root {root_ref}
  /Info {new_info_id} 0 R
>>
startxref
{xref_offset}
%%EOF
"""
    updated_data = data + info_obj.encode('latin1') + new_xref.encode('latin1')
    with open(pdf_path, "wb") as f:
        f.write(updated_data)

    return True

def main():
    print("=" * 65)
    print("  AINE.WS SUPER-METADATA INJECTION & ENTITY ENHANCEMENT")
    print("=" * 65)

    injected_assets = []

    # 1. Author Headshots (Converted to Black & White + 32-Field Injection)
    author_shots = [
        (
            os.path.join(PUBLIC_DIR, "authors", "justin-davis.jpg"),
            "Justin Davis: Founder & Lead Search Analyst at Aine (AINE.ws)",
            "Justin Davis is the founder and lead search analyst at Aine (AINE.ws). He conducts empirical field research on Generative Engine Optimization (GEO), Google AI Overviews, algorithmic local search proximity, and autonomous voice AI lead telephony.",
            GLOBAL_KEYWORDS + ["Founder", "Lead Search Analyst", "Editorial Byline", "B&W Portrait"]
        ),
        (
            os.path.join(PUBLIC_DIR, "authors", "justin-davis-slate.jpg"),
            "Justin Davis: Editorial Analyst Portrait | Aine (AINE.ws)",
            "Verified editorial portrait of Justin Davis, publisher of Aine (AINE.ws). Analyzing technical search architecture, LLM citation graphs, and speed-to-lead pipelines.",
            GLOBAL_KEYWORDS + ["Founder", "Lead Search Analyst", "Verified Author"]
        ),
        (
            os.path.join(PUBLIC_DIR, "authors", "molly-perkins.jpg"),
            "Molly Perkins: Lead Voice AI & Inbound Telephony Correspondent",
            "Molly Perkins investigates conversational voice AI receptionists, whisper call routing, missed-call textback speed-to-lead, and telecom automation for Aine (AINE.ws).",
            GLOBAL_KEYWORDS + ["Molly Perkins", "Voice AI", "Lead Response", "Telephony"]
        ),
        (
            os.path.join(PUBLIC_DIR, "authors", "elena-chen.jpg"),
            "Elena Chen: Local Commerce & Maps Search Analyst",
            "Elena Chen covers Google Business Profile algorithmic filtering, AI review summaries in Google Maps, and commercial search proximity patterns for Aine (AINE.ws).",
            GLOBAL_KEYWORDS + ["Elena Chen", "Google Maps 3-Pack", "Local SEO", "Review Automation"]
        )
    ]

    print("\n[Step 1/5] Injecting Author Portraits (Black & White Editorial)...")
    for path, title, desc, kws in author_shots:
        if os.path.exists(path):
            # Ensure Justin Davis is crisp B&W
            if "justin-davis" in path:
                im = Image.open(path)
                gray = ImageOps.grayscale(im)
                enhanced = ImageEnhance.Contrast(gray).enhance(1.12)
                rgb = enhanced.convert("RGB")
                rgb.save(path, "JPEG", quality=95, optimize=True)

            success = inject_jpeg(path, title, desc, kws)
            if success:
                injected_assets.append(("Author Portrait", os.path.relpath(path, WORKSPACE_ROOT)))
                print(f"  ✓ {os.path.basename(path)} (32 fields + B&W conversion)")

    # 2. Main OpenGraph & Social Cards
    print("\n[Step 2/5] Injecting Brand OpenGraph & Social Preview Cards...")
    og_images = [
        (
            os.path.join(PUBLIC_DIR, "og-image.jpg"),
            "Aine (AINE.ws): The Applied AI & Algorithmic Commerce Wire",
            "Aine (AINE.ws) is an independent digital news and algorithmic research publication delivering empirical search audits, GEO benchmarks, and lead response testing.",
            GLOBAL_KEYWORDS + ["OpenGraph Social Card", "Applied AI Wire", "Global Publication"]
        )
    ]
    for path, title, desc, kws in og_images:
        if os.path.exists(path):
            success = inject_jpeg(path, title, desc, kws)
            if success:
                injected_assets.append(("Social Card", os.path.relpath(path, WORKSPACE_ROOT)))
                print(f"  ✓ {os.path.basename(path)}")

    # 3. Logos & App Icons (PNG + SVG)
    print("\n[Step 3/5] Injecting Brand Logos, Favicons, and App Icons...")
    brand_assets = [
        (
            os.path.join(PUBLIC_DIR, "favicon.svg"),
            "Aine (AINE.ws) Official Stamp Favicon",
            "Official SVG stamp icon of Aine: Applied Intelligence Wire (aine.ws). Editorial serif AI over monospace NE.WS.",
            "svg"
        ),
        (
            os.path.join(PUBLIC_DIR, "icon.svg"),
            "Aine (AINE.ws) Core Vector Icon",
            "Primary vector stamp mark for Aine (AINE.ws).",
            "svg"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-square-512.svg"),
            "Aine (AINE.ws) 512px Vector Brand Stamp",
            "High-resolution vector square brand mark for Aine (AINE.ws).",
            "svg"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-wide-dark.svg"),
            "Aine (AINE.ws) Wide Dark Vector Wordmark",
            "Vector masthead wordmark with phonetic pronunciation for dark displays.",
            "svg"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-wide-light.svg"),
            "Aine (AINE.ws) Wide Light Vector Wordmark",
            "Vector masthead wordmark with phonetic pronunciation for light displays.",
            "svg"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-square-512.png"),
            "Aine (AINE.ws) 512px PNG Stamp Logo",
            "High-resolution square PNG stamp emblem for Aine (AINE.ws).",
            "png"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-wide-dark.png"),
            "Aine (AINE.ws) Wide Dark PNG Masthead",
            "Primary dark masthead PNG logo for Aine (AINE.ws).",
            "png"
        ),
        (
            os.path.join(PUBLIC_DIR, "logo-wide-light.png"),
            "Aine (AINE.ws) Wide Light PNG Masthead",
            "Primary light masthead PNG logo for Aine (AINE.ws).",
            "png"
        ),
        (
            os.path.join(PUBLIC_DIR, "favicon.png"),
            "Aine (AINE.ws) PNG Favicon",
            "Standard web browser favicon for Aine (AINE.ws).",
            "png"
        ),
        (
            os.path.join(PUBLIC_DIR, "apple-touch-icon.png"),
            "Aine (AINE.ws) Apple Touch Icon",
            "iOS and Apple touch device home screen bookmark icon for Aine (AINE.ws).",
            "png"
        )
    ]
    for path, title, desc, kind in brand_assets:
        if os.path.exists(path):
            if kind == "svg":
                ok = inject_svg(path, title, desc, GLOBAL_KEYWORDS)
            elif kind == "png":
                ok = inject_png(path, title, desc, GLOBAL_KEYWORDS)
            if ok:
                injected_assets.append((f"Brand Asset ({kind.upper()})", os.path.relpath(path, WORKSPACE_ROOT)))
                print(f"  ✓ {os.path.basename(path)}")

    # 4. News Feature Editorial Images
    print("\n[Step 4/5] Injecting Core News Editorial & Telemetry Images...")
    news_dir = os.path.join(PUBLIC_DIR, "news")
    editorial_news_images = [
        (
            "geo-entity-optimization.jpg",
            "Generative Engine Optimization (GEO): Why LLMs Favor Entity Graphs Over Backlinks",
            "Empirical search audit analyzing how Google AI Overviews, Perplexity, and ChatGPT cite structured schema entities over legacy PageRank links."
        ),
        (
            "google-ai-overview-search.jpg",
            "Google AI Overviews Dynamic Retrieval and Local 3-Pack Telemetry",
            "Technical investigation on how dynamic AI search summaries parse local business knowledge graphs and direct answers."
        ),
        (
            "google-core-update.jpg",
            "Google Core Algorithm Rollout: E-E-A-T and Author Credentialing Architecture",
            "Search engine evaluation study examining author entity verification and technical editorial attribution standards."
        ),
        (
            "telephony-speed-to-lead.jpg",
            "B2B Speed-to-Lead Study: Inbound Lead Qualification Decay and Automated Telephony",
            "Field benchmark proving sales qualification drops 21x after 5 minutes of response delay, and how automated textback secures pipeline."
        ),
        (
            "voice-ai-latency.jpg",
            "Voice AI Telephony Latency Benchmarks: Sub-300ms Conversational Thresholds",
            "Empirical telecom testing of real-time conversational voice agents, SIP trunk latency, and inbound call qualification."
        ),
        (
            "crm-automation-blueprint.jpg",
            "Zero-Data-Entry CRM Architectures: Automated Pipeline Telephony",
            "Blueprint on integrating automated whisper routing, missed-call SMS, and continuous CRM synchronization."
        ),
        (
            "local-citation-audit.jpg",
            "The 2026 Local Citation Audit: Directory Consistency & AI Knowledge Graphs",
            "Analysis of how commercial business directories and NAP consistency establish verifiable entity nodes for AI search engines."
        ),
        (
            "schema-graph-entity.jpg",
            "Why Connected Schema @graph Frameworks Outperform Fragmented Microdata",
            "Structural technical guide on JSON-LD @graph architectures for Google Knowledge Graph and LLM crawler ingestion."
        ),
        (
            "mcp-agent-architecture.jpg",
            "Model Context Protocol (MCP) Enterprise Architecture & Benchmark Teardown",
            "Technical teardown of autonomous agent tool calling protocols, standardized API connectors, and memory structures."
        ),
        (
            "programmatic-seo-guidelines.jpg",
            "Navigating Google Scaled Content Policies: Programmatic Quality Guidelines",
            "Algorithmic compliance analysis on building high-value programmatic data hubs without triggering spam classifier penalties."
        ),
        (
            "contractor-video-seo.jpg",
            "Automated Vertical Video Strategy for Rich Google Search Snippets",
            "Field guide on how video structured data and schema markup earn prominent rich snippets in local mobile search results."
        ),
        (
            "hubspot-vs-gohighlevel-2026-audit.jpg",
            "HubSpot vs GoHighLevel (2026): Total Cost, AI Agents & B2B Pipeline Audit",
            "Head-to-head financial and technical comparison of enterprise CRM architectures and AI reception workflows."
        ),
        (
            "hubspot-vs-salesforce-2026-audit.jpg",
            "HubSpot vs Salesforce (2026): Total Cost of Ownership Audit",
            "Comprehensive total cost analysis of CRM seat pricing, custom developer overhead, and AI telephony integrations."
        )
    ]
    for filename, title, desc in editorial_news_images:
        path = os.path.join(news_dir, filename)
        if os.path.exists(path):
            kws = GLOBAL_KEYWORDS + [title[:40], "Editorial Report", "Aine Wire"]
            ok = inject_jpeg(path, title, desc, kws)
            if ok:
                injected_assets.append(("News Feature Image", os.path.relpath(path, WORKSPACE_ROOT)))
                print(f"  ✓ {filename}")

    # 5. Companion Whitepaper & Research PDFs
    print("\n[Step 5/5] Injecting Companion Research & Telemetry PDFs...")
    pdf_targets = [
        (
            os.path.join(PUBLIC_DIR, "reports", "ainews-wire-publication-entity-protocol.pdf"),
            "Aine (AINE.ws) Wire Publication Entity & Verification Protocol",
            GLOBAL_KEYWORDS + ["Entity Protocol", "Publication Standards", "Whitepaper"]
        ),
        (
            os.path.join(PUBLIC_DIR, "reports", "sacramento-regional-search-telemetry-81node-audit.pdf"),
            "Sacramento Regional Search Telemetry & 81-Node Proximity Grid Audit",
            GLOBAL_KEYWORDS + ["Sacramento", "81-Node Grid", "Search Telemetry", "Proximity Audit"]
        ),
        (
            os.path.join(PUBLIC_DIR, "reports", "sacramento-regional-search-local-ranking-81node-audit.pdf"),
            "Sacramento Regional Local Search Ranking Audit: 81-Node Field Analysis",
            GLOBAL_KEYWORDS + ["Sacramento Local Search", "81-Node Telemetry", "Map Pack"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "sacramento-regional-search-telemetry-81node-audit.pdf"),
            "Sacramento Regional Search Telemetry Geo-Vault Audit Archive",
            GLOBAL_KEYWORDS + ["Sacramento Vault", "Search Telemetry", "Field Audit"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "folsom-ca-gold-standard-folsom-headquarters-regional-grid-geo-authority.pdf"),
            "Folsom Headquarters Regional Grid Geo-Authority Whitepaper",
            GLOBAL_KEYWORDS + ["Folsom HQ", "Regional Grid", "Entity Authority"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "folsom-ca-sacramento-regional-google-maps-3pack-authority-geo-authority.pdf"),
            "Sacramento Regional Google Maps 3-Pack Authority Telemetry Report",
            GLOBAL_KEYWORDS + ["Google Maps 3-Pack", "Sacramento", "Authority Protocol"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "folsom-ca-water-damage-3pack-revenue-engine-geo-authority.pdf"),
            "Emergency Services 3-Pack Revenue Engine & Speed-to-Lead Telemetry",
            GLOBAL_KEYWORDS + ["Speed to Lead", "3-Pack Revenue", "Emergency Telemetry"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "folsom-ca-the-4-proprietary-systems-of-local-geo-authority.pdf"),
            "The Four Proprietary Systems of Local GEO Authority",
            GLOBAL_KEYWORDS + ["Four Proprietary Systems", "GEO Engine", "Whitepaper"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "folsom-ca-google-maps-3pack-domination-contractors-blueprint-geo-authority.pdf"),
            "Google Maps 3-Pack Domination Blueprint for Trade Contractors",
            GLOBAL_KEYWORDS + ["Contractor Blueprint", "Google Maps 3-Pack", "Lead Capture"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "roseville-ca-why-google-maps-3pack-ranking-geo-authority.pdf"),
            "Why Google Maps 3-Pack Ranking Telemetry Dictates Local Market Share",
            GLOBAL_KEYWORDS + ["Roseville CA", "Maps Ranking Telemetry", "Market Share"]
        ),
        (
            os.path.join(PUBLIC_DIR, "geo-vault", "roseville-ca-how-to-rank-in-google-maps-geo-authority.pdf"),
            "How to Rank in Google Maps: Algorithmic Geometry & Geo-Grid Strategy",
            GLOBAL_KEYWORDS + ["How to Rank in Google Maps", "Geo-Grid Strategy", "Algorithmic Geometry"]
        )
    ]
    for path, title, kws in pdf_targets:
        if os.path.exists(path):
            ok = inject_pdf_metadata(path, title, kws)
            if ok:
                injected_assets.append(("Companion PDF", os.path.relpath(path, WORKSPACE_ROOT)))
                print(f"  ✓ {os.path.basename(path)}")

    print("\n" + "=" * 65)
    print(f"  INJECTION COMPLETE: {len(injected_assets)} Assets Successfully Enhanced!")
    print("=" * 65)

    # Save injection manifest for transparency
    manifest_path = os.path.join(WORKSPACE_ROOT, "SUPER_METADATA_INJECTION_LEDGER.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "total_assets_injected": len(injected_assets),
            "headquarters": HEADQUARTERS,
            "assets": [
                {"category": cat, "path": p} for cat, p in injected_assets
            ]
        }, f, indent=2)
    print(f"Saved audit manifest to {os.path.relpath(manifest_path, WORKSPACE_ROOT)}")

if __name__ == "__main__":
    main()
