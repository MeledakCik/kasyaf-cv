import { NextRequest, NextResponse } from "next/server";
import { decryptPayload } from "@/lib/crypto";

const CV_CONTEXT = `
PENGALAMAN:
- Senior Frontend Engineer di startup fintech (2022–sekarang). Memimpin migrasi arsitektur dari monolith ke micro-frontend, memangkas waktu build 60%.
- Software Engineer di perusahaan e-commerce (2019–2022). Membangun sistem rekomendasi produk real-time menggunakan collaborative filtering.

KEAHLIAN TEKNIS:
TypeScript, React, Next.js, Node.js, WebGPU, arsitektur sistem terdistribusi, dan machine learning terapan (embedding, vector search).

PROYEK:
- Membangun 'Brain-in-Browser', sebuah sistem RAG yang berjalan 100% di client-side tanpa API pihak ketiga, menggunakan HNSW buatan sendiri dan WebLLM.

PENDIDIKAN:
S1 Teknik Informatika, fokus riset pada information retrieval dan sistem terdistribusi.

KONTAK:
- Email: [email protected] (gunakan form kontak di halaman)
- LinkedIn: [linkedin.com/in/username]
- GitHub: [github.com/username]
- Terbuka untuk peluang remote/hybrid di bidang AI infrastructure dan frontend engineering.
`;

const buildSystemPrompt = (detectedSection: string | null, dynamicContext: string) => {
  if (detectedSection) {
    return `Anda adalah asisten AI yang bertugas mengarahkan pengguna ke bagian tertentu di halaman profile.

🚨 INSTRUKSI UTAMA (WAJIB DIUTAMAKAN):
- Pengguna meminta untuk diarahkan ke bagian '${detectedSection}'.
- Anda HANYA boleh memberikan respons singkat yang mengonfirmasi bahwa Anda telah mengarahkan mereka ke bagian yang benar.
- Contoh respons: "Tentu, saya sudah arahkan Anda ke bagian ${detectedSection}." atau "Silakan lihat bagian ${detectedSection} yang sudah saya tampilkan."
- JANGAN memberikan informasi tambahan apapun tentang profil, keahlian, pengalaman, atau proyek.
- JANGAN menjawab pertanyaan asli pengguna selain konfirmasi navigasi.
- Respons harus sangat pendek (1-2 kalimat) dan langsung ke inti.

KONTEKS (HANYA UNTUK REFERENSI, JANGAN DIGUNAKAN UNTUK MENJAWAB):
${dynamicContext}
`;
  }

  return `Anda adalah asisten AI untuk portofolio Muhammad Kasyaf Anugrah.

ATURAN UTAMA (WAJIB DIPATUHI):
1. **NAMA PEMILIK ADALAH "Muhammad Kasyaf Anugrah".** Ini adalah fakta absolut. Jangan pernah salah mengeja, menyingkat, atau mengubah nama ini dalam kondisi apapun. Ulangi nama ini dengan benar jika ditanya.

2. **JAWAB HANYA BERDASARKAN "KONTEKS PROFILE".** Semua jawaban Anda harus berasal dari teks yang ada di dalam "KONTEKS PROFILE".

3. **JIKA INFORMASI TIDAK ADA, BERHENTI.** Jika pertanyaan tidak bisa dijawab dari "KONTEKS PROFILE", respons Anda HANYA boleh "Maaf, saya tidak memiliki informasi tentang itu di dalam profile." Jangan menambahkan kata "namun", jangan menawarkan bantuan lain, jangan mencoba menjawab. Cukup kalimat itu saja.

4. **BERIKAN JAWABAN DETAIL.** Jika informasi tersedia, berikan jawaban yang detail dan lengkap berdasarkan konteks.

=== KONTEKS PROFILE ===
${dynamicContext}
=== AKHIR KONTEKS ===`;
};

export async function POST(request: NextRequest) {
  try {
    const { payload } = await request.json();
    if (!payload) {
      return NextResponse.json({ error: "Payload terenkripsi tidak ada" }, { status: 400 });
    }

    const { message, profileContext, detectedSection } = await decryptPayload<{
      message: string;
      profileContext: any;
      detectedSection: string | null;
    }>(payload);

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY tidak ditemukan di environment");
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    let dynamicContext = CV_CONTEXT;
    if (profileContext && Object.keys(profileContext).length > 0) {
      const skillsList = (profileContext.skills || []).slice(0, 30).join(", ");
      const experienceList = (profileContext.experience || []).slice(0, 20).join("; ");
      const projectsList = (profileContext.projects || []).slice(0, 15).join("; ");
      const aboutText = profileContext.about || "";
      const contactText = profileContext.contact || "";
      const summaryText = profileContext.summary || "";

      dynamicContext = `
=== INFORMASI DARI HALAMAN PROFILE (Real-time) ===

SKILLS YANG DITAMPILKAN:
${skillsList || "Tidak ada skills terdeteksi"}

PENGALAMAN KERJA:
${experienceList || "Tidak ada pengalaman terdeteksi"}

PROYEK:
${projectsList || "Tidak ada proyek terdeteksi"}

TENTANG:
${aboutText || "Tidak ada informasi tambahan"}

KONTAK:
${contactText || "Informasi kontak tersedia di halaman profile"}

RINGKASAN UNTUK AI:
${summaryText || "Pemilik portofolio memiliki berbagai keahlian dan pengalaman. Berikan jawaban yang informatif dan detail."}

=== KONTEKS DASAR (Fallback) ===
${CV_CONTEXT}
`;
    }

    const systemPrompt = buildSystemPrompt(detectedSection || null, dynamicContext);

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: detectedSection ? 60 : 1024,
        temperature: detectedSection ? 0 : 0.7,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error("[Groq API Error]", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Gagal memanggil Groq API" },
        { status: groqResponse.status }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.indexOf("\n");

            while (boundary !== -1) {
              const line = buffer.substring(0, boundary).trim();
              buffer = buffer.substring(boundary + 1);

              if (line.startsWith("data: ")) {
                const data = line.substring(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (parseError) {
                  console.warn("[Stream Parse]", parseError);
                }
              }
              boundary = buffer.indexOf("\n");
            }
          }
          controller.close();
        } catch (streamError) {
          console.error("[Stream Error]", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[Chat API Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}