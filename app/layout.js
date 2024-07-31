import { Montserrat } from "next/font/google";
import "./globals.css";
import NavbarComponent from "@/components/Navbar";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Prodapt - AIO",
  description: "Dev - Nandha",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarComponent />
        {children}
      </body>
    </html>
  );
}
