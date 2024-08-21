'use server';
import Image, { getImageProps } from 'next/image';

const nextImageLoader = ({ src, width, quality }: any) => {
  return `${src}?${width}&q=${quality || 75}`;
};

const ContentfulImage = (props: any) => {
  if (props.mobSrc !== undefined) {
    const common = { alt: props.alt, width: 800, height: 400 };
    const {
      props: { srcSet: desktop, ...rest },
    } = getImageProps({
      ...common,
      width: props.width,
      height: props.height,
      src: props.src,
    });
    const {
      props: { srcSet: mobile },
    } = getImageProps({
      ...common,
      width: props.mobWidth,
      height: props.mobHeight,
      src: props.mobSrc,
    });
    return (
      <picture className="w-full">
        <source media="(max-width: 1039px)" srcSet={mobile} />
        <source media="(min-width:1040)" srcSet={desktop} />
        <img {...rest} alt={props.alt} />
      </picture>
    );
  }
  return <Image alt={props.alt} {...props} />;
};

export default ContentfulImage;
