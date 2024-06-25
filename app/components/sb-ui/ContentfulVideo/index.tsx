'use server';
export const ContentfulVideo = (props: any) => {
  return (
    <video
      autoPlay
      muted
      loop
      className="w-full h-auto mx-auto my-0"
      style={{ maxWidth: props.maxWidth }}
      src={props.src}
    />
  );
};
