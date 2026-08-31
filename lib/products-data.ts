export const PRODUCT_CATEGORIES = [
  "Web App",
  "Mobile App",
  "Security Tool",
  "Landing Page",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  title: string;
  category: string;
  image: string; // path di /public, ganti dengan gambar produk kamu
  description: string;
  link: string; // link ke produk (live demo / store / github)
}

/* -------------------------------------------------------------------------- */
/*  DATA — ganti title, category, image, description, dan link tiap produk   */
/*  Taruh gambar produk di public/images/products/                            */
/* -------------------------------------------------------------------------- */

export const PRODUCTS: Product[] = [
  {
    id: "product-1",
    title: "Nama Produk 1",
    category: "Web App",
    image: "/images/products/product-1.png",
    description: "Deskripsi singkat produk pertama kamu, 1-2 kalimat.",
    link: "https://example.com/product-1",
  },
  {
    id: "product-2",
    title: "Nama Produk 2",
    category: "Mobile App",
    image: "/images/products/product-2.png",
    description: "Deskripsi singkat produk kedua kamu, 1-2 kalimat.",
    link: "https://example.com/product-2",
  },
  {
    id: "product-3",
    title: "Nama Produk 3",
    category: "Security Tool",
    image: "/images/products/product-3.png",
    description: "Deskripsi singkat produk ketiga kamu, 1-2 kalimat.",
    link: "https://example.com/product-3",
  },
  {
    id: "product-4",
    title: "Nama Produk 4",
    category: "Landing Page",
    image: "/images/products/product-4.png",
    description: "Deskripsi singkat produk keempat kamu, 1-2 kalimat.",
    link: "https://example.com/product-4",
  },
  {
    id: "product-5",
    title: "Nama Produk 5",
    category: "Web App",
    image: "/images/products/product-5.png",
    description: "Deskripsi singkat produk kelima kamu, 1-2 kalimat.",
    link: "https://example.com/product-5",
  },
];
