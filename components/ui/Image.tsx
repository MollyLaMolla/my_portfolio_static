import NextImage, { type ImageProps, type StaticImageData } from "next/image";

export type { StaticImageData };

const basePath = "/my_portfolio_static";

export default function Image(props: ImageProps) {
  const src =
    typeof props.src === "string" && props.src.startsWith("/")
      ? `${basePath}${props.src}`
      : props.src;
  return <NextImage {...props} src={src} />;
}
