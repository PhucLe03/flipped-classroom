'use client';

import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface MovieClipProps {
  videoId: string;
  id?: string;
  title?: string;
}

export class MovieClip extends React.Component<MovieClipProps> {
  render() {
    const { videoId, id = 'video', title } = this.props;

    const options: YouTubeProps['opts'] = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
      },
    };

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-100 bg-black shadow-inner">
        <YouTube
          videoId={videoId || 'Oflbho9ZG2U'}
          opts={options}
          onReady={this._onReady}
          id={id}
          className="w-full h-full"
          iframeClassName="w-full h-full border-0"
          title={title || 'YouTube video player'}
        />
      </div>
    );
  }

  _onReady(event: any) {
    if (event?.target?.pauseVideo) {
      event.target.pauseVideo();
    }
  }
}

export default MovieClip;
