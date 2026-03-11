//global styles
import "@/app/css/global.css";
import { roboto_flex } from "@/app/font/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto_flex.className} antialiased`}>{children}</body>
    </html>
  );
}
