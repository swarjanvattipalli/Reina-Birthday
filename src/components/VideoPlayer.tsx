interface VideoPlayerProps {
  videoSrc: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  return (
    <div className="flex justify-center w-full">
      <video
        autoPlay
        muted
        controls
        playsInline
        className="
          w-[260px]
          sm:w-[300px]
          md:w-[340px]
          aspect-[9/16]
          object-cover
          rounded-3xl
          shadow-[0_20px_60px_rgba(244,63,94,0.35)]
          border-2
          border-pink-300/30
        "
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}