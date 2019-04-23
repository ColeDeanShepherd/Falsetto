import * as React from "react";

export const YouTubeVideo: React.FunctionComponent<{ videoId: string, style?: any }> = props => (
  <div style={Object.assign({ maxWidth: "560px" }, props.style)}>
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
      <iframe
        src={`https://www.youtube.com/embed/${props.videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ margin: "0 auto", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
    </div>
  </div>
);