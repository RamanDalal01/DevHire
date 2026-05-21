import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "DevHire — Elite Developer Job Board Platform",
  description: "DevHire is a skill-first, developer-first platform designed exclusively to match elite engineering talent with top-tier technology companies. Built by developers, for developers.",
  keywords: "developer jobs, software engineer jobs, tech job board, React developers, Node.js jobs",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-[#0A0F1D] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 4000, 
              style: { 
                background: '#0F172A', 
                color: '#F1F5F9', 
                border: '1px solid #1E293B' 
              } 
            }} 
          />
          <Navbar />
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
