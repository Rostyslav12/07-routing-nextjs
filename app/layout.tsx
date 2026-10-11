
import type { Metadata } from "next";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Application for managing personal notes",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({
  children,
  modal,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <div className="page">
            <Header />
            <main className="content">{children}</main>
            <Footer />
          </div>

          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}
