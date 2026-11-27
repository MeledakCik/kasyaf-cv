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
];
