import React from "react";
import Channel from "../data/Channel";

interface ChannelListProps {
  channels: Channel[];
}

export default function ChannelList(props: ChannelListProps) {
  return (
    <>
      {props.channels.map((channel) => (
        <div key={channel.name}>
          {channel.thumbnail && <img src={channel.thumbnail} />}
          <p>
            {channel.name} ({channel.videoCount} videos)
          </p>
        </div>
      ))}
    </>
  );
}
