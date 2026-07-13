import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"星の翼 仕様クイズ",description:"全20問で挑む、星の翼の非公式仕様クイズ＆クイズ作成ツール。"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
