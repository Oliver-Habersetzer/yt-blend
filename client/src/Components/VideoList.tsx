import React from "react";
import Video from "../data/Video";

interface VideoListProps {
  videos: Video[];
}

export default function VideoList(props: VideoListProps) {
  return (
    <>
      {props.videos.map((video) => (
        <div key={video.title}>
          {video.thumbnail && <img src={video.thumbnail} />}
          <p>
            {video.channel.name}: {video.title} (Likes: {video.likes} |
            Comments: {video.comments} | Views: {video.views})
          </p>
        </div>
      ))}
    </>
  );
}
