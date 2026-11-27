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
];
