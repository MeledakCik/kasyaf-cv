// Security research shown on /experience and in /llms.txt.
// Rules for this content: no payloads, no exploit steps, no attacker tool
// names, no CVE claims. Describe the research class, the audit work and the
// remediation that was delivered, nothing that would help reproduce an attack.

export type Lang = "en" | "id";

export interface ResearchSection {
  heading: string;
  body: string;
  points?: string[];
}

export interface SecurityResearchItem {
  acronym: string;
  name: string;
  type: Record<Lang, string>;
  stack: string[];
  /** One-line summary under the title. */
  summary: Record<Lang, string>;
  /** Short version: 4 bullets, fit for a one-page CV. */
  cv: Record<Lang, string[]>;
  /** Long version: portfolio write-up. */
  detail: Record<Lang, ResearchSection[]>;
}

export const securityResearch: SecurityResearchItem[] = [
  {
    acronym: "RECES",
    name: "Reserve Engine Command Execute Server",
    type: {
      en: "Independent research · Approved testing · Isolated lab",
      id: "Riset mandiri · Pengujian disetujui · Lab terisolasi",
    },
    stack: ["Next.js", "Laravel", "Node.js", "Dependency / Supply Chain"],
    summary: {
      en: "How built-in command execution, parsers, routing and dependencies in modern web stacks turn into critical server-side risk when input is not filtered and privileges are not limited.",
      id: "Bagaimana fitur command execution bawaan, parser, routing, dan dependency di stack web modern berubah menjadi risiko kritis di sisi server ketika input tidak difilter dan hak akses tidak dibatasi.",
    },
    cv: {
      en: [
        "Conducted independent security research (RECES) into how built-in command execution, parsers, routing and third-party dependencies in Next.js, Laravel and Node.js applications become critical server-side vulnerabilities when input is unfiltered and process privileges are unrestricted.",
        "Audited application entry points and full dependency trees, including transitive packages, in an isolated lab to map recurring risk patterns from user input to server-side execution.",
        "Presented live, controlled demonstrations to stakeholders, translating technical findings into business impact and a prioritized remediation plan.",
        "Delivered hardening guidance (command allowlisting, input validation and sanitization, dependency updates, least-privilege service accounts, server hardening) through responsible disclosure; no third-party data was accessed, stored or shared.",
      ],
      id: [
        "Melakukan riset keamanan mandiri (RECES) tentang bagaimana fitur command execution bawaan, parser, routing, dan dependency pihak ketiga pada aplikasi Next.js, Laravel, dan Node.js dapat menjadi celah kritis di sisi server bila input tidak difilter dan hak akses proses tidak dibatasi.",
        "Mengaudit titik masuk aplikasi dan seluruh pohon dependency, termasuk paket transitif, di lab terisolasi untuk memetakan pola risiko yang berulang dari input pengguna hingga eksekusi di server.",
        "Melakukan demo langsung yang terkontrol di depan stakeholder, menerjemahkan temuan teknis menjadi dampak bisnis dan rencana perbaikan berdasarkan prioritas.",
        "Menyerahkan rekomendasi hardening (allowlist perintah, validasi dan sanitasi input, update dependency, akun layanan least-privilege, hardening server) melalui responsible disclosure; tidak ada data pihak lain yang diakses, disimpan, atau disebarkan.",
      ],
    },
    detail: {
      en: [
        {
          heading: "Background",
          body: "Modern frameworks ship with powerful features: helpers that run system processes, flexible request parsers, dynamic routing and a large ecosystem of packages. Each is safe on its own. The risk shows up in the gaps: user input that reaches one of these features without being filtered, a process running with more privileges than it needs, or an outdated package deep in the dependency tree. RECES (Reserve Engine Command Execute Server) is my research into where those gaps form and how to close them.",
        },
        {
          heading: "Scope",
          body: "The research focuses on server-side applications built with Next.js, Laravel and Node.js. All testing was approved in advance and ran inside an isolated lab.",
          points: [
            "Built-in command and process execution features used by applications",
            "Request parsers, routing and the data flow from user input to server logic",
            "Direct and transitive dependencies (software supply chain)",
            "Privileges and configuration of the process and server running the application",
          ],
        },
        {
          heading: "Approach",
          body: "The work is an audit, not a hunt for one exploit. I map every entry point, trace where input flows, review which dependencies (and which versions) the application actually ships, and check what an application process is allowed to do on the server. Every pattern found is validated in the lab and documented together with its fix.",
        },
        {
          heading: "What I delivered",
          body: "",
          points: [
            "Live, controlled demonstrations for stakeholders, explaining the risk in terms of business impact, not just technical detail",
            "A prioritized remediation plan: command allowlisting, input validation and sanitization, dependency updates and version pinning, least-privilege service accounts, and server hardening",
            "A reusable review checklist for framework features and dependencies, applied in my own Full Stack projects",
          ],
        },
        {
          heading: "Ethics & responsible disclosure",
          body: "I carried out this research on my own, in my own lab, and only with approved testing. I do not access, store or distribute anyone else's data. Findings are shared directly with the relevant stakeholders with a focus on fixes, and I do not publish payloads or exploit steps.",
        },
      ],
      id: [
        {
          heading: "Latar belakang",
          body: "Framework modern membawa fitur yang kuat: helper untuk menjalankan proses sistem, parser request yang fleksibel, routing dinamis, dan ekosistem paket yang besar. Masing-masing aman jika berdiri sendiri. Risiko muncul di celahnya: input pengguna yang sampai ke salah satu fitur itu tanpa difilter, proses yang berjalan dengan hak akses lebih besar dari yang dibutuhkan, atau paket usang jauh di dalam pohon dependency. RECES (Reserve Engine Command Execute Server) adalah riset saya tentang di mana celah itu terbentuk dan bagaimana menutupnya.",
        },
        {
          heading: "Ruang lingkup",
          body: "Riset ini berfokus pada aplikasi sisi server yang dibangun dengan Next.js, Laravel, dan Node.js. Seluruh pengujian sudah mendapat persetujuan sebelumnya dan dijalankan di dalam lab terisolasi.",
          points: [
            "Fitur command dan process execution bawaan yang dipakai aplikasi",
            "Parser request, routing, dan alur data dari input pengguna ke logika server",
            "Dependency langsung maupun transitif (software supply chain)",
            "Hak akses dan konfigurasi proses serta server yang menjalankan aplikasi",
          ],
        },
        {
          heading: "Pendekatan",
          body: "Pekerjaan ini adalah audit, bukan perburuan satu exploit. Saya memetakan setiap titik masuk, menelusuri ke mana input mengalir, meninjau dependency (beserta versinya) yang benar-benar ikut terpasang, dan memeriksa apa saja yang boleh dilakukan proses aplikasi di server. Setiap pola yang ditemukan divalidasi di lab dan didokumentasikan bersama perbaikannya.",
        },
        {
          heading: "Yang saya hasilkan",
          body: "",
          points: [
            "Demo langsung yang terkontrol untuk stakeholder, menjelaskan risiko dari sisi dampak bisnis, bukan hanya detail teknis",
            "Rencana perbaikan berdasarkan prioritas: allowlist perintah, validasi dan sanitasi input, update dan penguncian versi dependency, akun layanan least-privilege, serta hardening server",
            "Checklist review yang bisa dipakai ulang untuk fitur framework dan dependency, diterapkan di proyek Full Stack saya sendiri",
          ],
        },
        {
          heading: "Etika & responsible disclosure",
          body: "Riset ini saya kerjakan sendiri, di lab sendiri, dan hanya dengan pengujian yang sudah disetujui. Saya tidak mengakses, menyimpan, atau menyebarkan data milik orang lain. Temuan disampaikan langsung ke stakeholder terkait dengan fokus pada perbaikan, dan saya tidak mempublikasikan payload maupun langkah exploit.",
        },
      ],
    },
  },
  {
    acronym: "IRI",
    name: "Indexing Route Injection",
    type: {
      en: "Independent research · Approved testing · Isolated lab",
      id: "Riset mandiri · Pengujian disetujui · Lab terisolasi",
    },
    stack: ["Next.js", "Laravel", "Search Engine Indexing", "Technical SEO"],
    summary: {
      en: "How dynamic routes, reflected parameters and soft-404 pages let outsiders get URLs of their choosing indexed by search engines under a trusted domain, and how to keep the index clean.",
      id: "Bagaimana route dinamis, parameter yang dipantulkan, dan halaman soft-404 bisa membuat pihak luar mengindeks URL pilihan mereka di mesin pencari atas nama domain tepercaya, dan bagaimana menjaga indeks tetap bersih.",
    },
    cv: {
      en: [
        "Conducted independent research (Indexing Route Injection) into how catch-all and dynamic routes, search and filter pages, and URL parameters reflected into page titles, metadata or canonical tags let third parties create indexable pages on a trusted domain.",
        "Audited routing, status codes, canonical and robots signals, and sitemap generation in Next.js and Laravel applications inside an isolated lab to map where unknown URLs return 200 instead of a real 404.",
        "Explained the business impact to stakeholders: index pollution, spam or misleading pages appearing under the brand in search results, wasted crawl budget and damaged domain reputation.",
        "Delivered remediation guidance (real 404/410 for unknown routes, allowlisted canonical URLs, noindex for search and parameter pages, no reflection of user input into metadata, sitemaps generated from trusted data only, index monitoring) through responsible disclosure.",
      ],
      id: [
        "Melakukan riset mandiri (Indexing Route Injection) tentang bagaimana route catch-all dan dinamis, halaman pencarian dan filter, serta parameter URL yang dipantulkan ke judul, metadata, atau tag canonical bisa dipakai pihak ketiga untuk membuat halaman yang terindeks di domain tepercaya.",
        "Mengaudit routing, status code, sinyal canonical dan robots, serta pembuatan sitemap pada aplikasi Next.js dan Laravel di lab terisolasi untuk memetakan di mana URL yang tidak dikenal menjawab 200, bukan 404 yang sebenarnya.",
        "Menjelaskan dampak bisnis ke stakeholder: indeks yang tercemar, halaman spam atau menyesatkan muncul atas nama brand di hasil pencarian, crawl budget terbuang, dan reputasi domain rusak.",
        "Menyerahkan rekomendasi perbaikan (404/410 asli untuk route tak dikenal, URL canonical berbasis allowlist, noindex untuk halaman pencarian dan parameter, tidak memantulkan input pengguna ke metadata, sitemap hanya dari data tepercaya, pemantauan indeks) melalui responsible disclosure.",
      ],
    },
    detail: {
      en: [
        {
          heading: "Background",
          body: "Search engines trust a domain as a whole. If an application answers any URL with a normal page, and that page repeats part of the URL back in its title, heading or canonical tag, then anyone can invent a URL, link to it from elsewhere and have it crawled and indexed as if the site owner had published it. Indexing Route Injection is my research into where applications open that door and how to shut it.",
        },
        {
          heading: "Scope",
          body: "The research covers Next.js and Laravel applications. All testing was approved in advance and ran inside an isolated lab.",
          points: [
            "Catch-all and dynamic routes, and how they respond to slugs that do not exist",
            "Search, filter and pagination pages driven by URL parameters",
            "Titles, meta descriptions, canonical tags and structured data built from request input",
            "Status codes, robots directives and sitemap generation",
          ],
        },
        {
          heading: "Approach",
          body: "I map every route an application exposes, check what each one returns for valid, unknown and unexpected input, and trace whether any part of the request ends up in the indexable parts of the page. I then compare the signals the page sends to crawlers (status code, canonical, robots, sitemap) with what the owner actually meant to publish. Every pattern is validated in the lab and documented together with its fix.",
        },
        {
          heading: "What I delivered",
          body: "",
          points: [
            "Controlled demonstrations for stakeholders showing how the issue looks in search results and what it means for the brand",
            "A remediation plan: real 404/410 for unknown routes, canonical URLs built from an allowlist, noindex on search and parameter pages, escaping and never reflecting raw input into metadata, sitemaps generated only from trusted data",
            "A monitoring routine for the search index (unexpected URLs, sudden growth in indexed pages) that I also apply to my own sites",
          ],
        },
        {
          heading: "Ethics & responsible disclosure",
          body: "I carried out this research on my own, in my own lab, and only with approved testing. I did not publish spam pages on anyone else's domain or submit third-party URLs to search engines. Findings are shared directly with the relevant stakeholders with a focus on fixes, and I do not publish payloads or exploit steps.",
        },
      ],
      id: [
        {
          heading: "Latar belakang",
          body: "Mesin pencari memercayai sebuah domain secara keseluruhan. Jika aplikasi menjawab URL apa pun dengan halaman normal, dan halaman itu mengulang sebagian URL di judul, heading, atau tag canonical, siapa pun bisa mengarang URL, menautkannya dari tempat lain, lalu URL itu di-crawl dan diindeks seolah-olah dipublikasikan pemilik situs. Indexing Route Injection adalah riset saya tentang di mana aplikasi membuka celah itu dan bagaimana menutupnya.",
        },
        {
          heading: "Ruang lingkup",
          body: "Riset ini mencakup aplikasi Next.js dan Laravel. Seluruh pengujian sudah mendapat persetujuan sebelumnya dan dijalankan di dalam lab terisolasi.",
          points: [
            "Route catch-all dan dinamis, serta respons mereka terhadap slug yang tidak ada",
            "Halaman pencarian, filter, dan paginasi yang digerakkan parameter URL",
            "Judul, meta description, tag canonical, dan structured data yang dibentuk dari input request",
            "Status code, direktif robots, dan pembuatan sitemap",
          ],
        },
        {
          heading: "Pendekatan",
          body: "Saya memetakan setiap route yang dibuka aplikasi, memeriksa apa yang dikembalikan untuk input yang valid, tidak dikenal, dan tidak terduga, lalu menelusuri apakah ada bagian request yang masuk ke bagian halaman yang bisa diindeks. Setelah itu saya membandingkan sinyal yang dikirim halaman ke crawler (status code, canonical, robots, sitemap) dengan apa yang sebenarnya ingin dipublikasikan pemilik. Setiap pola divalidasi di lab dan didokumentasikan bersama perbaikannya.",
        },
        {
          heading: "Yang saya hasilkan",
          body: "",
          points: [
            "Demo terkontrol untuk stakeholder yang menunjukkan bagaimana masalah ini terlihat di hasil pencarian dan apa artinya bagi brand",
            "Rencana perbaikan: 404/410 asli untuk route tak dikenal, URL canonical dari allowlist, noindex di halaman pencarian dan parameter, escaping dan tidak pernah memantulkan input mentah ke metadata, sitemap hanya dari data tepercaya",
            "Rutinitas pemantauan indeks pencarian (URL tak terduga, lonjakan jumlah halaman terindeks) yang juga saya terapkan di situs saya sendiri",
          ],
        },
        {
          heading: "Etika & responsible disclosure",
          body: "Riset ini saya kerjakan sendiri, di lab sendiri, dan hanya dengan pengujian yang sudah disetujui. Saya tidak memublikasikan halaman spam di domain milik orang lain dan tidak mengirim URL pihak ketiga ke mesin pencari. Temuan disampaikan langsung ke stakeholder terkait dengan fokus pada perbaikan, dan saya tidak mempublikasikan payload maupun langkah exploit.",
        },
      ],
    },
  },
  {
    acronym: "JSB",
    name: "JWT Signature Bypass via Encryption & CDN Cache Layers",
    type: {
      en: "Independent research · Approved testing · Isolated lab",
      id: "Riset mandiri · Pengujian disetujui · Lab terisolasi",
    },
    stack: ["JWT / JWE", "Encryption", "CDN / Reverse Proxy Cache", "Next.js", "Node.js", "Laravel"],
    summary: {
      en: "How a system protected by two layers, encryption and a reverse proxy or CDN cache, can serve data sessions to requests whose JWT signature was never verified, and how to make the signature check unavoidable.",
      id: "Bagaimana sistem yang dilindungi dua lapis, yaitu enkripsi dan reverse proxy atau cache CDN, bisa menyajikan sesi data ke request yang signature JWT-nya tidak pernah diverifikasi, dan bagaimana membuat pemeriksaan signature tidak bisa dilewati.",
    },
    cv: {
      en: [
        "Conducted independent research into systems that protect data with two layers, encryption and a reverse proxy or CDN cache, and how authenticated data can be served without the JWT signature ever being checked.",
        "Audited Next.js, Node.js and Laravel applications in an isolated lab: encryption used in place of a signature (decrypt-then-trust), JWE tokens without a verified inner signature, and CDN cache keys and headers for authenticated API responses.",
        "Focused on data sessions (API responses carrying user or business data) rather than login sessions, and explained the impact to stakeholders: data exposure to requests that never proved their identity.",
        "Delivered remediation guidance (authenticated encryption or sign-then-encrypt with the signature verified after decryption, pinned algorithms and keys, no shared caching of authenticated data, edge verification with identity in the cache key where caching is required) through responsible disclosure.",
      ],
      id: [
        "Melakukan riset mandiri tentang sistem yang melindungi data dengan dua lapis, yaitu enkripsi dan reverse proxy atau cache CDN, serta bagaimana data yang seharusnya terautentikasi bisa tersaji tanpa signature JWT pernah diperiksa.",
        "Mengaudit aplikasi Next.js, Node.js, dan Laravel di lab terisolasi: enkripsi yang dipakai sebagai pengganti signature (decrypt lalu langsung dipercaya), token JWE tanpa signature di dalamnya yang diverifikasi, serta kunci cache dan header CDN untuk respons API yang terautentikasi.",
        "Berfokus pada sesi data (respons API yang membawa data pengguna atau data bisnis), bukan sesi login, dan menjelaskan dampaknya ke stakeholder: data terbuka untuk request yang tidak pernah membuktikan identitasnya.",
        "Menyerahkan rekomendasi perbaikan (enkripsi terautentikasi atau sign-then-encrypt dengan signature diverifikasi setelah dekripsi, algoritma dan key yang dikunci, tidak menyimpan data terautentikasi di shared cache, verifikasi di edge dengan identitas masuk ke kunci cache bila cache memang dibutuhkan) melalui responsible disclosure.",
      ],
    },
    detail: {
      en: [
        {
          heading: "Background",
          body: "Some systems feel well protected because data passes through two layers: it is encrypted, and it sits behind a reverse proxy or CDN cache. Neither layer proves who sent a request. Encryption hides content but, without authentication, does not show that a token was issued by the server, so decrypting a token and then trusting it is not the same as verifying its signature. A CDN cache answers from what it stored earlier, so if authenticated data is cached under a key that ignores the token, the origin, the only place the signature is checked, never sees the request. This research looks at how these two layers together let data sessions through without a valid signature, and how to design that out.",
        },
        {
          heading: "Scope",
          body: "The research focuses on data sessions, meaning API responses that carry user or business data, not login sessions. It covers Next.js, Node.js and Laravel applications behind a reverse proxy or CDN. All testing was approved in advance and ran inside an isolated lab.",
          points: [
            "Encryption used as if it were integrity: encryption without a MAC, decrypt-then-trust logic, and JWE tokens whose inner signature is not verified",
            "Algorithm and key configuration for signing and encryption that is not pinned",
            "Reverse proxy and CDN cache rules for authenticated API responses: cache key, Vary, Cache-Control and which headers are ignored",
            "Edge checks that only look at whether a token is present or well formed, while the signature is verified only at the origin",
          ],
        },
        {
          heading: "Approach",
          body: "I trace a data request from the CDN edge to the origin handler and record which layer actually makes the trust decision on a cache miss and on a cache hit. For the encryption layer I check whether integrity is verified after decryption or only assumed. For the cache layer I check what the cache key is built from and whether responses that depend on identity can be stored and replayed to another request. Every pattern is validated in the lab with tokens and data I created myself, and documented together with its fix.",
        },
        {
          heading: "What I delivered",
          body: "",
          points: [
            "Controlled demonstrations for stakeholders showing the difference between a request that reaches the origin and one answered by the cache, explained in terms of data exposure and business impact",
            "A remediation plan: authenticated encryption (AEAD) or sign-then-encrypt with the signature verified after decryption, pinned algorithms and keys, Cache-Control private or no-store for authenticated data, and where edge caching is required, JWT verification at the edge with the verified identity in the cache key",
            "Regression tests that send tampered and unsigned tokens against both cold and warm cache paths, applied to my own projects",
          ],
        },
        {
          heading: "Ethics & responsible disclosure",
          body: "I carried out this research on my own, in my own lab, and only with approved testing, using tokens, accounts and data I created. I do not access, store or distribute anyone else's data. Findings are shared directly with the relevant stakeholders with a focus on fixes, and I do not publish payloads, forged tokens or exploit steps.",
        },
      ],
      id: [
        {
          heading: "Latar belakang",
          body: "Sebagian sistem terasa aman karena data melewati dua lapis: data dienkripsi, dan berada di belakang reverse proxy atau cache CDN. Tidak satu pun dari lapisan itu membuktikan siapa pengirim request. Enkripsi menyembunyikan isi, tetapi tanpa autentikasi tidak menunjukkan bahwa token memang diterbitkan server, sehingga men-decrypt token lalu langsung memercayainya tidak sama dengan memverifikasi signature. Cache CDN menjawab dari apa yang sudah disimpan sebelumnya, jadi jika data terautentikasi disimpan di cache dengan kunci yang mengabaikan token, origin, satu-satunya tempat signature diperiksa, tidak pernah melihat request itu. Riset ini membahas bagaimana dua lapisan ini bersama-sama meloloskan sesi data tanpa signature yang valid, dan bagaimana mendesain sistem agar tidak terjadi.",
        },
        {
          heading: "Ruang lingkup",
          body: "Riset ini berfokus pada sesi data, yaitu respons API yang membawa data pengguna atau data bisnis, bukan sesi login. Cakupannya aplikasi Next.js, Node.js, dan Laravel di belakang reverse proxy atau CDN. Seluruh pengujian sudah mendapat persetujuan sebelumnya dan dijalankan di dalam lab terisolasi.",
          points: [
            "Enkripsi yang diperlakukan seolah menjamin integritas: enkripsi tanpa MAC, logika decrypt lalu percaya, dan token JWE yang signature di dalamnya tidak diverifikasi",
            "Konfigurasi algoritma dan key untuk signing maupun enkripsi yang tidak dikunci",
            "Aturan cache reverse proxy dan CDN untuk respons API terautentikasi: kunci cache, Vary, Cache-Control, dan header apa saja yang diabaikan",
            "Pemeriksaan di edge yang hanya melihat ada tidaknya token atau formatnya, sementara signature hanya diverifikasi di origin",
          ],
        },
        {
          heading: "Pendekatan",
          body: "Saya menelusuri request data dari edge CDN sampai handler di origin dan mencatat lapisan mana yang sebenarnya mengambil keputusan percaya saat cache miss dan saat cache hit. Untuk lapisan enkripsi saya memeriksa apakah integritas diverifikasi setelah dekripsi atau hanya diasumsikan. Untuk lapisan cache saya memeriksa dari apa kunci cache dibentuk dan apakah respons yang bergantung pada identitas bisa tersimpan lalu disajikan ke request lain. Setiap pola divalidasi di lab dengan token dan data yang saya buat sendiri, lalu didokumentasikan bersama perbaikannya.",
        },
        {
          heading: "Yang saya hasilkan",
          body: "",
          points: [
            "Demo terkontrol untuk stakeholder yang menunjukkan perbedaan request yang sampai ke origin dan yang dijawab cache, dijelaskan dari sisi keterbukaan data dan dampak bisnis",
            "Rencana perbaikan: enkripsi terautentikasi (AEAD) atau sign-then-encrypt dengan signature diverifikasi setelah dekripsi, algoritma dan key yang dikunci, Cache-Control private atau no-store untuk data terautentikasi, dan bila cache di edge memang dibutuhkan, verifikasi JWT di edge dengan identitas terverifikasi masuk ke kunci cache",
            "Regression test yang mengirim token yang diubah dan token tanpa signature di jalur cache dingin maupun hangat, diterapkan di proyek saya sendiri",
          ],
        },
        {
          heading: "Etika & responsible disclosure",
          body: "Riset ini saya kerjakan sendiri, di lab sendiri, dan hanya dengan pengujian yang sudah disetujui, memakai token, akun, dan data yang saya buat sendiri. Saya tidak mengakses, menyimpan, atau menyebarkan data milik orang lain. Temuan disampaikan langsung ke stakeholder terkait dengan fokus pada perbaikan, dan saya tidak mempublikasikan payload, token palsu, maupun langkah exploit.",
        },
      ],
    },
  },
];
