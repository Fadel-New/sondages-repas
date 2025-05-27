import "@/styles/globals.css";
import "../components/ui/FormStyles.css"; // Import form styles globally
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
