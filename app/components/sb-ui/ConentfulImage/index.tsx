'use server';
import Image from 'next/image';

const nextImageLoader = ({ src, width, quality }: any) => {
  return `${src}?${width}&q=${quality || 75}`;
};

type Props = {
  src: string;
  mobSrc?: string;
  alt: string;
  width: number;
  height: number;
  mobWidth?: number;
  mobHeight?: number;
  className?: string;
};

const ContentfulImage = (props: Props) => {
  // if (props.mobSrc !== undefined) {
  //   const common = { alt: props.alt, width: 800, height: 400 };
  //   const {
  //     props: { srcSet: desktop, ...rest },
  //   } = getImageProps({
  //     ...common,
  //     width: props.width,
  //     height: props.height,
  //     src: props.src,
  //   });
  //   const {
  //     props: { srcSet: mobile },
  //   } = getImageProps({
  //     ...common,
  //     width: props.mobWidth,
  //     height: props.mobHeight,
  //     src: props.mobSrc,
  //   });
  //   return (
  //     <picture className="w-full">
  //       <source media="(max-width: 1039px)" srcSet={mobile} />
  //       <source media="(min-width:1040)" srcSet={desktop} />
  //       <img {...rest} alt={props.alt} />
  //     </picture>
  //   );
  // }
  return <Image {...props} />;
};

export default ContentfulImage;
