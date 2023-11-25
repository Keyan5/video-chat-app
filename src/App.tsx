import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

function App() {
  const [peerId, setPeerId] = useState("");

  const selfVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const idInput = useRef<HTMLInputElement>(null);

  const selfPeer = useRef<Peer>();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    selfPeer.current = peer;

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((selfStream) => {
          if (selfVideo.current) {
            selfVideo.current.srcObject = selfStream;
            selfVideo.current.play();
          }

          call.answer(selfStream);

          call.on("stream", (remoteStream) => {
            if (remoteVideo.current) {
              remoteVideo.current.srcObject = remoteStream;
              remoteVideo.current.play();
            }
          });
        });
    });
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(peerId);
  };

  const handlePasteId = () => {
    navigator.clipboard.readText().then((text) => {
      if (idInput.current) {
        idInput.current.value = text;
      }
    });
  };

  const handleCall = (id: string) => {
    if (!id) return alert("Please enter an id");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((selfStream) => {
        if (selfVideo.current) {
          selfVideo.current.srcObject = selfStream;
          selfVideo.current.play();
        }

        const call = selfPeer.current?.call(id, selfStream);

        console.log(call);

        call?.on("stream", (remoteStream) => {
          console.log(remoteStream);

          if (remoteVideo.current) {
            remoteVideo.current.srcObject = remoteStream;
            remoteVideo.current.play();
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };

  const handleHangup = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-around h-screen gap-5 ">
      <video
        className="w-3/4 h-[90%] rounded m-4"
        ref={remoteVideo}
        poster="https://tavistockdental.co.uk/wp-content/uploads/2017/11/placeholder-f.jpg"
      />
      <div className="flex flex-col gap-2 m-4 justify-around h-full">
        <div className="flex flex-col gap-2 m-4">
          <h4
            className="text-xl font-bold text-center cursor-pointer"
            onClick={handleCopyId}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCopyId();
            }}
          >
            Your ID:{" "}
            <span title="copy Id" className="text-blue-500">
              {peerId}
            </span>
          </h4>
          <label htmlFor="idInput" className="text-slate-500">
            Receiver ID
          </label>
          <input
            ref={idInput}
            id="idInput"
            type="text"
            onClick={handlePasteId}
            className="focus:outline-none border border-gray-500 h-10 leading-10 rounded "
          />
          <button
            type="button"
            onClick={() => handleCall(idInput.current?.value ?? "")}
            className="bg-green-500 hover:bg-green-600 rounded text-white h-10"
          >
            Call
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 rounded text-white h-10"
            onClick={handleHangup}
          >
            Hang up
          </button>
        </div>
        <video
          className="h-64 rounded m-2"
          ref={selfVideo}
          poster="https://3.bp.blogspot.com/_Xmev_6exX3I/TCSWXv1O_cI/AAAAAAAAAIA/8y-0mCTDvTo/s1600/YOU.jpg"
        />
      </div>
    </div>
  );
}

export default App;
