import React from "react";
import Video from "../data/Video";

interface VideoListProps {
  videos: Video[];
}

export default function VideoList(props: VideoListProps) {
  return (
    <div className="d-inline-flex flex-wrap overflow-y-scroll">
      {props.videos.map((video) => (
        <div
          key={video.title}
          className="m-1 p-1 shadow shadow-sm border border-white flex-grow"
        >
          {video.thumbnail && <img src={video.thumbnail} />}
          <p>
            {video.channel.name}: {video.title} (Likes: {video.likes} |
            Comments: {video.comments} | Views: {video.views})
          </p>
        </div>
      ))}
    </div>
  );
}
