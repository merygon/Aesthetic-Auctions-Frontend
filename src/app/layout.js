import "./globals.css";
import Footer from "@/components/Footer/Footer";
import { AuctionsProvider } from "@/context/AuctionContext";
import { BidsProvider } from "@/context/bidContext";
import { CommentsProvider } from "@/context/commentContext";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="body">
        <AuctionsProvider>
          <BidsProvider>
            <CommentsProvider>
              <main>{children}</main>
              <Footer />
            </CommentsProvider>
          </BidsProvider>
        </AuctionsProvider>
      </body>
    </html>
  );
}
