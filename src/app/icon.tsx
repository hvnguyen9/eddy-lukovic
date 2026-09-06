import { ImageResponse } from "next/og";

// Browser-tab icon: the same boxed "EL" monogram used in the site header.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2efe9",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #2e2825",
            color: "#2e2825",
            fontSize: 28,
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
            letterSpacing: -1,
          }}
        >
          EL
        </div>
      </div>
    ),
    size
  );
}
