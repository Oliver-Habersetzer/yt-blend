import consumer from "./consumer"

let room_id;
let session_id;

document.addEventListener('turbolinks:load', function() {
  room_id = document.getElementById("room-id").getAttribute("data-room-id");
  session_id = document.getElementById("session-id").getAttribute("data-session-id");

  consumer.subscriptions.create({channel: "RoomChannel", id: room_id}, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("Connected to ws");
      broadcast("JOIN_ROOM");
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

const broadcast = (data) => {
  const csrfToken = document.querySelector("[name=csrf-token]").content;
  const headers = new Headers({
    "content-type": "application/json",
    "X-CSRF-TOKEN": csrfToken,
  });

  fetch("/sessions/broadcast", {
    method: "POST",
    body: JSON.stringify(
        {session: {
            room_id: room_id,
            user: session_id,
            message: data
          }}),
    headers,
  });
}
