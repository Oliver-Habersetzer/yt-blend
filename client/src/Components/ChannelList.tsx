import React from "react";
import Channel from "../data/Channel";

interface ChannelListProps {
  channels: Channel[];
}

export default function ChannelList(props: ChannelListProps) {
  return (
    <div className="d-inline-flex flex-wrap overflow-y-scroll">
      {props.channels.map((channel) => (
        <div
          key={channel.name}
          className="m-1 p-1 shadow shadow-sm border border-white flex-grow"
        >
          {channel.thumbnail && <img src={channel.thumbnail} />}
          <p>
            {channel.name} ({channel.videoCount} videos)
          </p>
        </div>
      ))}
    </div>
  );
}
