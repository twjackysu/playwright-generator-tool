import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playwright Generator Tool",
  description: "A tool to generate Playwright code for your web interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
