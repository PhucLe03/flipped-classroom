'use client';

import React from 'react';

interface MovieClipProps {
  videoId: string;
  id?: string;
  title?: string;
}

export const MovieClip: React.FC<MovieClipProps> = ({
  videoId,
  id = 'video',
  title,
}) => {
  const currentVideoId = videoId || 'Oflbho9ZG2U';
  const iframeSrc = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=1&rel=0&enablejsapi=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-100 bg-black shadow-inner">
      <iframe
        id={id}
        src={iframeSrc}
        title={title || 'YouTube video player'}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default MovieClip;

