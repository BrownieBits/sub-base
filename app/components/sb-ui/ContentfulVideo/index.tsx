'use server';
export const ContentfulVideo = (props: any) => {
  return (
    <video
      autoPlay
      muted
      loop
      className="mx-auto my-0 h-auto w-full"
      style={{ maxWidth: props.maxWidth }}
      src={props.src}
    />
  );
};
