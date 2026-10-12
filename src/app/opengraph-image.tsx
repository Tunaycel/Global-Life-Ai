import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "GlobalLife AI: Yurtdışı Hayalini AI ile Gerçekleştir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    const logo = await readFile(join(process.cwd(), "public/brand/globallife-logo.svg"), "base64");

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 96px",
                    background: "#0A0A12",
                    color: "#FFFFFF",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:image/svg+xml;base64,${logo}`} width={96} height={96} alt="" />
                    <span style={{ fontSize: 48, fontWeight: 700 }}>GlobalLife AI</span>
                </div>
                <div style={{ marginTop: 48, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
                    Yurtdışı Hayalini AI ile Gerçekleştir
                </div>
            </div>
        ),
        size
    );
}
