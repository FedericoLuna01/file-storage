import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileStorage",
  description: "Almacenamiento de archivos en la nube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className}`}>
        <ConvexClientProvider>
          <Toaster />
          <div className="grid grid-rows-[auto,1fr,auto] min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
