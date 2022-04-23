import consumer from "./consumer"

// Inspired by https://github.com/jeanpaulsio/action-cable-signaling-server

// Message types
const JOIN = "JOIN";
const EXCHANGE = "EXCHANGE";
const LEAVE = "LEAVE";

const ice = { iceServers: [{ urls: "stun:192.168.0.134:3478" }] };

let room_id;
let session_id;

let pcPeers = {};


document.addEventListener('turbolinks:load', function() {
  room_id = document.getElementById("room-id").getAttribute("data-room-id");
  session_id = document.getElementById("session-id").getAttribute("data-session-id");

  document.getElementById("test-rtc").onclick = function () {
    console.log("?", pcPeers);
    for (let peer in pcPeers) {
      console.log("Sending peer msg to", pcPeers[peer]);
      pcPeers[peer].sendChannel.send("Yoyo?");
    }
  };

  consumer.subscriptions.create({channel: "RoomChannel", id: room_id}, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("Connected to ws");
      broadcast(JOIN);
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log("Disconnected from ws");
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      console.log("received", data);
      if (data.user === session_id) return;
      switch (data.type) {
        case JOIN:
          createPeerConnection(data.user, true);
          break;
        case EXCHANGE:
          if (data.to !== session_id) return;
          exchange(data);
          break;
        case LEAVE:
          break;
        default:
          console.log("Unknown message type", data);
      }
    }
  });
});

const createPeerConnection = (user, isOffer) => {
  console.log("Connecting to peer", user);
  let pc = new RTCPeerConnection(ice);
  pcPeers[user] = pc;

  pc.sendChannel = pc.createDataChannel('sendDataChannel', {});

  pc.sendChannel.onopen = (event) => {
    console.log("Data channel opened");
    pc.sendChannel.send("Yoyo?");
  };

  pc.onicecandidate = (event) => {
    event.candidate &&
    broadcast(EXCHANGE, {
      user: session_id,
      to: user,
      candidate: JSON.stringify(event.candidate),
    });
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === "disconnected") {
      console.log("Disconnected:", user);
      broadcast(LEAVE, {
        user: user,
      });
    }
  };

  pc.ondatachannel = (event) => {
    pc.receiveChannel = event.channel;
    pc.receiveChannel.onmessage = (msg) => (alert("Received peer msg: " + msg.data))
  }

  isOffer &&
  pc
      .createOffer(
          {offerToReceiveAudio: false, offerToReceiveVideo: false}
      )
      .then((offer) => {
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        broadcast(EXCHANGE, {
          user: session_id,
          to: user,
          sdp: JSON.stringify(pc.localDescription),
        });
      })
      .catch(console.warn);


  return pc;
}

const exchange = (data) => {
  let pc;

  if (!pcPeers[data.user]) {
    pc = createPeerConnection(data.user, false);
  } else {
    pc = pcPeers[data.user];
  }

  if (data.candidate) {
    pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
        .then(() => console.log("Ice candidate added"))
        .catch(console.warn);
  }

  if (data.sdp) {
    const sdp = JSON.parse(data.sdp);
    pc.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => {
          if (sdp.type === "offer") {
            pc.createAnswer({offerToReceiveAudio: false, offerToReceiveVideo: false})
                .then((answer) => {
                  return pc.setLocalDescription(answer);
                })
                .then(() => {
                  broadcast(EXCHANGE, {
                    user: session_id,
                    to: data.user,
                    sdp: JSON.stringify(pc.localDescription),
                  });
                });
          }
        })
        .catch(console.warn);
  }
}

const broadcast = (type, message) => {
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
            type: type,
            ...message
          }}),
    headers,
  });
}
