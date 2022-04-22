class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
