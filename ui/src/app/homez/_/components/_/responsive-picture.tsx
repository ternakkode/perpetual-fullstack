import {
  type ImageProps,
  type StaticImageData,
  getImageProps,
} from "next/image";

/* eslint-disable jsx-a11y/alt-text */
export const ResponsivePicture = ({
  source,
  ...props
}: Omit<ImageProps, "src"> & {
  source: {
    desktop: {
      height: number;
      src: StaticImageData;
    };
    mobile: {
      height: number;
      src: StaticImageData;
    };
    tablet: {
      height: number;
      src: StaticImageData;
    };
  };
}) => {
  const common: Omit<ImageProps, "src"> = {
    ...props,
    draggable: false,
    sizes: "100vw",
  };

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    height: source.desktop.height,
    quality: 100,
    src: source.desktop.src,
    width: 1024,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...common,
    height: source.tablet.height,
    quality: 100,
    src: source.tablet.src,
    width: 768,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    height: source.mobile.height,
    quality: 100,
    src: source.mobile.src,
    width: 375,
  });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} />
      <source media="(min-width: 768px)" srcSet={tablet} />
      <source media="(min-width: 375px)" srcSet={mobile} />
      <img {...rest} style={{ width: "100%", height: "auto" }} />
    </picture>
  );
};
