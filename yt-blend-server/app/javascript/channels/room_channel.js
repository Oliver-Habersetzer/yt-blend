import consumer from "./consumer"

document.addEventListener('turbolinks:load', function() {
  const room_id = document.getElementById("room-id").getAttribute("data-room-id");

  consumer.subscriptions.create({channel: "RoomChannel", id: room_id}, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("Connected to ws");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log("Disconnected from ws");
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      console.log(data);
    }
  });
});
