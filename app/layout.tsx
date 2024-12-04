import localFont from "next/font/local";
import "@/app/globals.css";
import StoreProvider from "./StoreProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Uncomment this code if you're using client-side mounting logic
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true); // Set to true once mounted
  // }, []);

  // if (!mounted) {
  //   return null; // Return null until the component is mounted
  // }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
