import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "ratellm — reviews for open-source AI models",
  description:
    "Search open-source AI models on Hugging Face and read what builders actually think. Rate models and share how you use them.",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-lg font-semibold tracking-tight"
        >
          ratellm
          <span className="hidden text-sm font-normal text-neutral-400 sm:inline dark:text-neutral-500">
            Model reviews
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            Models
          </Link>
          <a
            href="https://huggingface.co/models"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Hugging Face ↗
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-neutral-500 sm:px-6 dark:text-neutral-400">
        <span>ratellm</span>
        <span>Reviews for open-source AI models.</span>
      </div>
    </footer>
  );
}
