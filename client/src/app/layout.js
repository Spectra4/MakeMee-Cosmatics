"use client"
import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";
import LoadingProvider from "../components/LoadingOverlay";

// Define default SEO/Metadata variables
const defaultTitle = "MakeMee Cosmetics | Premium Beauty Products Online";
const defaultDescription = "Shop high-quality cosmetics, skincare, and beauty products from MakeMee. Discover the latest trends and best deals for your perfect look.";
const canonicalUrl = "https://www.yourdomain.com/"; // **IMPORTANT: Replace with your actual domain**
const defaultKeywords = "cosmetics, beauty products, skincare, makeup, online store, MakeMee, beauty shop";
const defaultImage = `${canonicalUrl}social-share-image.jpg`; // **IMPORTANT: Create and link a social share image**


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ======================= 1. Basic SEO Tags ======================= */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="MakeMee Cosmetics Team" />
        
        {/* ======================= 2. Canonical & Robots ======================= */}
        {/* Helps search engines find the original source */}
        <link rel="canonical" href={canonicalUrl} />
        {/* Instructs search engines to index (follow links) */}
        <meta name="robots" content="index, follow" />
        
        {/* ======================= 3. Favicons ======================= */}
        <link rel="shortcut icon" href="logo.webp" type="image/x-icon" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />

        {/* ======================= 4. Open Graph (Facebook/LinkedIn/WhatsApp) ======================= */}
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MakeMee Cosmetics" />
        <meta property="og:type" content="website" /> {/* Use 'article' for blog pages */}
        <meta property="og:image" content={defaultImage} />
        <meta property="og:image:alt" content="MakeMee Cosmetics Logo and Banner" />
        <meta property="og:locale" content="en_IN" />

        {/* ======================= 5. Twitter Card Tags ======================= */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MakeMeeCosmetics" /> {/* Replace with your Twitter handle */}
        <meta name="twitter:creator" content="@MakeMeeCosmetics" /> {/* Replace with your Twitter handle */}
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultImage} />

      </head>
      <body>
        {/* It's redundant to have two LoadingProvider instances, remove one: */}
        {/* <LoadingProvider /> */}
          <Provider store={store}>
            {children}
          </Provider>
        <LoadingProvider />
      </body> 
    </html>
  );
}