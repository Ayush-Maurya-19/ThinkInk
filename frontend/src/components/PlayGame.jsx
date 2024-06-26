import { useCallback, useEffect, useRef, useState } from "react";
import SketchCanvas from "./SketchCanvas";
import constants from "../constants";
import Menu from "./Menu";
import GameOver from "./GameOver";
import Countdown from "./Countdown";
import { io } from "socket.io-client";
import { AnimatePresence } from "framer-motion";
import UseSocketContext from "../SocketContext";
import UseGameContext from "../GameContext";
import ScoreContainer from "./ScoreContainer";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds) => {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const PlayGame = () => {
  const {
    getDoodle,
    currentDoodle,
    setCurrentDoodle,
    socketID,
    socket,
    currentRoom,
    drawEnabled,
    setDrawEnabled,
    nextPlayerTurn,
  } = UseSocketContext();

  const { setScore } = UseGameContext();

  // Model loading
  const [ready, setReady] = useState(false);

  // Game state
  const [gameState, setGameState] = useState("menu");
  const [countdown, setCountdown] = useState(constants.COUNTDOWN_TIMER);
  const [gameCurrentTime, setGameCurrentTime] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [output, setOutput] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [sketchHasChanged, setSketchHasChanged] = useState(false);

  // What the user must sketch
  const [targets, setTargets] = useState(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [checkHandleMainClick, setCheckHandleMainClick] = useState(false);

  const navigate = useNavigate();

  const [currentRound, setCurrentRound] = useState(0);

  // temp
  const [currentDrawingName, setCurrentDrawingName] = useState("");

  const clickedHandled = useRef(false);

  // Create a reference to the worker object.
  const worker = useRef(null);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.updateMultiplayerCanvas();
    }
    socket.on("update-room-canvas", (canvasData) => {
      console.log("update-room-canvas", canvasData);
      let base64String = arrayBufferToBase64(canvasData.data);
      canvasRef.current.updateMultiplayerCanvas(base64String);
    });

    socket.on('round-update', (roomData) => {
      setCurrentRound(roomData.currentRound);
    })

    socket.on('game-end', (roomData) => {
      console.log('game end');
      setGameState("end");
      navigate('/createroom');
    })

  }, []);

  const broadcastCanvasUpdates = () => {
    socket.emit("command-update-room-canvas", {
      room: currentRoom,
      canvasData: canvasRef.current.getCanvasData(),
    });
  };

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      const result = e.data;

      switch (result.status) {
        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          beginCountdown();
          break;

        case "update":
          // Generation update: update the output text.
          break;

        case "result":
          // TODO optimize:

          setIsPredicting(false);

          {
            const filteredResult = result.data.filter(
              (x) => !constants.BANNED_LABELS.includes(x.label)
            );
            const timespent = canvasRef.current.getTimeSpentDrawing();

            // Slowly start rejecting labels that are not the target
            const applyEasyMode = timespent - constants.REJECT_TIME_DELAY;
            if (
              applyEasyMode > 0 &&
              filteredResult[0].score > constants.START_REJECT_THRESHOLD
            ) {
              // The number of labels to reject
              let amount = applyEasyMode / constants.REJECT_TIME_PER_LABEL;

              for (
                let i = 0;
                i < filteredResult.length && i < amount + 1;
                ++i
              ) {
                if (filteredResult[i].label === currentDoodle) {
                  // The target label should not be rejected
                  continue;
                }
                if (amount > i) {
                  filteredResult[i].score = 0;
                } else {
                  // fractional amount
                  filteredResult[i].score *= i - amount;
                }
              }

              // sort again
              filteredResult.sort((a, b) => b.score - a.score);
            }

            // Normalize to be a probability distribution
            const sum = filteredResult.reduce((acc, x) => acc + x.score, 0);
            filteredResult.forEach((x) => (x.score /= sum));

            setOutput(filteredResult);
          }
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);
    // worker.current.addEventListener('error', alert);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  // Set up classify function
  const classify = useCallback(() => {
    if (worker.current && canvasRef.current) {
      const image = canvasRef.current.getCanvasData();
      // console.log(image);
      if (image !== null) {
        // console.log('classifying');
        setIsPredicting(true);
        worker.current.postMessage({ action: "classify", image });
      }
    }
  }, []);

  const canvasRef = useRef(null);

  const handleEndGame = (cancelled = false) => {
    endGame(cancelled);
  };

  const handleClearCanvas = (resetTimeSpentDrawing = false) => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas(resetTimeSpentDrawing);
    }
  };

  const beginCountdown = () => {
    setGameState("countdown");

    // Choose the targets here and shuffle
    const possibleLabels = Object.values(constants.LABELS).filter(
      (x) => !constants.BANNED_LABELS.includes(x)
    );
    shuffleArray(possibleLabels);

    setTargets(possibleLabels);
    setTargetIndex(0);
    // console.log(possibleLabels);

    getDoodle();
    // setCurrentDoodle(doodleName);
  };

  const handleMainClick = () => {
    socket.emit("command-play-game", currentRoom);
    console.log(checkHandleMainClick);
    console.log("run handleMainClick");
    clickedHandled.current = true;
    if (!ready) {
      setGameState("loading");
      worker.current.postMessage({ action: "load" });
    } else {
      beginCountdown();
      
    }
  };

  useEffect(() => {
    socket.on("room-play-game", (createdRoom) => {
      setCurrentDrawingName(createdRoom.userDrawing.name);
      setCurrentRound(createdRoom.currentRound);
      console.log(createdRoom.userDrawing);
      console.log("event recieved");
      if (createdRoom.userDrawing.socketId === socketID) {
        setDrawEnabled(true);
      }
      if (!clickedHandled.current) {
        handleMainClick();
      }
    });

    socket.on("next-turn-start", (roomData) => {
      console.log("turn start");
      setCurrentDrawingName(roomData.userDrawing.name);
      if (socketID === roomData.userDrawing.socketId) {
        setDrawEnabled(true);
        // beginCountdown();
        handleGameOverClick(true);
      }
    });
  }, []);

  const updateCanvasChanges = () => {
    socket.emit("command-update-room-canvas", {
      room: currentRoom,
      canvasData: canvasRef.current.getCanvasContent(),
    });
  };

  const handleGameOverClick = (playAgain) => {
    if (playAgain) {
      beginCountdown();
    } else {
      endGame(true);
    }
  };

  // Detect for start of game
  useEffect(() => {
    if (gameState === "countdown" && countdown <= 0) {
      setGameStartTime(performance.now());
      setPredictions([]);
      setGameState("playing");
    }
  }, [gameState, countdown]);

  const addPrediction = useCallback(
    (isCorrect) => {
      setScore((prev) => prev + (isCorrect ? 1 : 0));
      // nextPlayerTurn();
      //      setScore("");

      // take snapshot of canvas
      const image = canvasRef.current.getCanvasData();
      setPredictions((prev) => [
        ...prev,
        {
          output: output?.[0] ?? null,
          image: image,
          correct: isCorrect,
          target: currentDoodle,
        },
      ]);
    },
    [output, targetIndex]
  );

  const endGame = useCallback(
    (cancelled = false) => {
      if (!cancelled) {
        addPrediction(false);
      }

      // reset
      setGameStartTime(null);
      setOutput(null);
      setSketchHasChanged(false);
      handleClearCanvas(true);
      setCountdown(constants.COUNTDOWN_TIMER);
      setGameState(cancelled ? "menu" : "end");

      //set score empty.....
      setScore("");
    },
    [addPrediction]
  );

  // Detect for end of game
  useEffect(() => {
    if (
      gameState === "playing" &&
      gameCurrentTime !== null &&
      gameStartTime !== null &&
      (gameCurrentTime - gameStartTime) / 1000 > constants.GAME_DURATION
    ) {
      console.log("game ended");

      if (drawEnabled) {
        nextPlayerTurn();
      }
      endGame();
    }
  }, [endGame, gameState, gameStartTime, gameCurrentTime]);

  const goNext = useCallback(
    (isCorrect = false) => {
      if (!isCorrect) {
        // apply skip penalty (done by pretending the game started earlier)
        setGameStartTime((prev) => {
          return prev - constants.SKIP_PENALTY;
        });
      }
      addPrediction(isCorrect);

      // setTargetIndex((prev) => prev + 1);
      setOutput(null);
      setSketchHasChanged(false);
      handleClearCanvas(true);
    },
    [addPrediction]
  );

  // detect for correct and go onto next
  useEffect(() => {
    if (gameState === "playing" && output !== null && currentDoodle !== null) {
      // console.log(targets[targetIndex], output[0])

      if (currentDoodle === output[0].label) {
        // Correct! Switch to next
        goNext(true);
        if (drawEnabled) {
          console.log("next player turn triggered");
          nextPlayerTurn();
        }
      }
    }
  }, [goNext, gameState, output, currentDoodle, targetIndex]);

  // GAME LOOP:
  useEffect(() => {
    if (gameState === "countdown") {
      const countdownTimer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => {
        clearInterval(countdownTimer);
      };
    } else if (gameState === "playing") {
      const classifyTimer = setInterval(() => {
        if (sketchHasChanged) {
          // console.log(isPredicting, sketchHasChanged);
          !isPredicting && classify();
        }
        setSketchHasChanged(false);

        setGameCurrentTime(performance.now());
      }, constants.PREDICTION_REFRESH_TIME);

      return () => {
        clearInterval(classifyTimer);
      };
    } else if (gameState === "end") {
      // The game ended naturally (after timer expired)
      handleClearCanvas(true);
    }
  }, [gameState, isPredicting, sketchHasChanged, addPrediction, classify]);

  useEffect(() => {
    if (gameState === "playing") {
      const preventDefault = (e) => e.preventDefault();
      document.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      return () => {
        document.removeEventListener("touchmove", preventDefault, {
          passive: false,
        });
      };
    }
  }, [gameState]);

  const menuVisible = gameState === "menu" || gameState === "loading";
  const isPlaying = gameState === "playing";
  const countdownVisible = gameState === "countdown";
  const gameOver = gameState === "end";
  return (
    <div className="" style={{ width: "100%" }}>
      <h4 style={{textAlign: 'center'}}> Round : {currentRound} </h4>
      {(!drawEnabled && currentDrawingName) && (`${currentDrawingName} is Drawing...`)}
      <div className="">
        <ScoreContainer />
      </div>
      {isPlaying && gameCurrentTime !== null && currentDoodle && (
        <div className="text-center">
          <h2 className="text-4xl ">Draw &quot;{currentDoodle}&quot;</h2>
          <h3 className="text-2xl">
            {formatTime(
              Math.max(
                constants.GAME_DURATION -
                  (gameCurrentTime - gameStartTime) / 1000,
                0
              )
            )}
          </h3>
        </div>
      )}
      {/*------------- this is the sketchcanvas files----------- */}
      <div className="flex flex-col">
        {isPlaying && (
          <div className={` ${isPlaying && drawEnabled ? "" : "pointer-events-none"}`}>
            {drawEnabled && <h2 className="text-center">Your Turn</h2>}
            <SketchCanvas
              onSketchChange={() => {
                // console.log(canvasRef.current.updateMultiplayerCanvas())
                // broadcastCanvasUpdates();
                setSketchHasChanged(true);
              }}
              ref={canvasRef}
            />
          </div>
        )}

        <AnimatePresence initial={false} mode="wait">
          {menuVisible && (
            <Menu gameState={gameState} onClick={handleMainClick} />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="wait">
          {countdownVisible && <Countdown countdown={countdown} />}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="wait">
          {gameOver && (
            <GameOver predictions={predictions} onClick={handleGameOverClick} currentDrawingName={currentDrawingName} />
          )}
        </AnimatePresence>

        {isPlaying && (
          <div className="mx-auto ">
            <h1 className="text-2xl font-bold mb-3">
              {output &&
                `Prediction: ${output[0].label} (${(
                  100 * output[0].score
                ).toFixed(1)}%)`}
            </h1>

            <div className="flex gap-2 text-white ">
              <button
                onClick={() => {
                  handleClearCanvas();
                }}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  goNext(false);
                }}
              >
                Skip
              </button>
              <button
                onClick={() => {
                  handleEndGame(true);
                }}
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;
