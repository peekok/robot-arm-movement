/*
 * Client Side Code
 */

import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

require("dotenv").config();

export default function ClientComponent() {
  const [changedMovements, toggleMovement] = useState(["", "", ""]); // joint, direction, position
  const [movement, setMovement] = useState(["x", "y", "z"]); // joint, direction, position
  const ENDPOINT = process.env.REACT_APP_ENDPOINT;

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.emit("handleMovements", changedMovements);
    socket.on("FromServer", (data) => {
      if (Object.keys(data).length === 0) return;
      setMovement(Object.entries(data));
    });
  }, [ENDPOINT, changedMovements]);

  function handleMovements(joint, direction, position) {
    toggleMovement([joint, direction, position]);
  }

  const commands = [
    {
      command: "clear",
      callback: () => resetTranscript(),
    },
    {
      command: "left",
      callback: () => moveLeft(),
    },
    {
      command: "right",
      callback: () => moveRight(),
    },
    {
      command: "up",
      callback: () => moveUp(),
    },
    {
      command: "down",
      callback: () => moveDown(),
    },
    {
      command: "\u0645\u0633\u062D",
      callback: () => resetTranscript(),
    },
    {
      command: "\u064A\u0633\u0627\u0631",
      callback: () => moveLeft(),
    },
    {
      command: "\u064A\u0645\u064A\u0646",
      callback: () => moveRight(),
    },
    {
      command: "\u0641\u0648\u0642",
      callback: () => moveUp(),
    },
    {
      command: "\u062A\u062D\u062A",
      callback: () => moveDown(),
    },
  ];

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition({ commands });

  const moveLeft = () => {
    handleMovements("base", "left", 0);
  };
  const moveRight = () => {
    handleMovements("base", "right", 180);
  };
  const moveUp = () => {
    handleMovements("shoulder", "up", 0);
  };
  const moveDown = () => {
    handleMovements("shoulder", "down", 180);
  };

  /* I closed this part because it is not necessary anymore while using johnny-five
   * But I left it to show how Web Serial API Works...
   * The main issue if we left it open is that we need to use the same port as the arduino
   * and the arduino needs to be connected to johnny-five
   * so It will cause a conflict if we use the same port for both
  /*
  const [port, setPort] = useState(0);
  const openSerialPort = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({
      baudRate: 11520,
    });
    setPort(port);
  };
  const closeSerialPort = async () => {
    // Close Serial Port
    await port.close();
    setPort(0);
  };
  */
  const startListeningEn = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: ["en-US"],
    });
  const startListeningAr = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: ["ar-SA"],
    });
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  if ("serial" in navigator) {
    // The Web Serial API is supported.
  }
  return (
    <div>
      {/* I mentioned that this is not necessary */}
      {/* {!port ? (
        <button onClick={openSerialPort}>Open Serial Port 🔓</button>
      ) : ( */}
      <>
        <p>Microphone: {listening ? "on 🔉" : "off 🔇"}</p>
        <p>
          <span> *BONUS* </span> Voice Commands:{" [ "}
          {commands.map((c) => c.command + ", ")}
          {"]"}
        </p>
        <button
          onTouchStart={startListeningEn}
          onMouseDown={startListeningEn}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={SpeechRecognition.stopListening}
        >
          Hold to talk [English (en-US)]
        </button>
        <button
          onTouchStart={startListeningAr}
          onMouseDown={startListeningAr}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={SpeechRecognition.stopListening}
        >
          أضغط للتحدث [العربية (المملكة العربية السعودية)]
        </button>
        <button
          onClick={() => {
            resetTranscript();
          }}
        >
          Click to remove transcript
        </button>
        <p>{transcript}</p>
        <p className="robotMovements">
          Robot Hand Movement:{" "}
          {movement.map(([key, val]) => (
            <span key={key}>
              <br />
              {key}: {val}
            </span>
          ))}
        </p>
        {/* <button onClick={closeSerialPort}>Close Serial Port 🔐</button> */}
      </>
      {/* ) } */}
    </div>
  );
}
