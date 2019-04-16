import * as React from "react";

export const YouTubeVideo: React.FunctionComponent<{ videoId: string }> = props => (
  <iframe
    width="560"
    height="315"
    src={`https://www.youtube.com/embed/${props.videoId}`}
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen />
);