import "./globals.css"

export const metadata = {
  title: "डिbunkit! - Fact Checker",
  description: "A vintage receipt-style fact-checking application",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
