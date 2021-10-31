import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration/index"
import Session from "./Sessions";
import PauseButtonHandler from "./Handlers";


//seeting up an initial state for our timer and session
const INITIAL_STATE = {
  isTimerRunning: false,
  session: null,
}

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}


/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  ///////////////////////////////////////////THESE ARE THE ONLY 4 STATES IN THIS ENTIRE APPLICATION. WHAT ARE THEY DOING? WHAT DO THEY NEED TO DO?///////////
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  //change to useState
  //connect to button focus duration
  const [focusDuration, setFocusDuration] = useState(25); 
  const [breakDuration, setBreakDuration] = useState(5); //changed to useState
  //create a handler for the focus - and + buttons

  /**
   * Custom hook that invokes the callback function every second
   * 
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
              /*timeRemaining: secondsToDuration(focusDuration * 60),*/
              
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function focusButtonDecrease() {
    if (focusDuration === 5) return;
      setFocusDuration(state => state - 5);
  };
  function focusButtonIncrease() {
    if (focusDuration === 60) return; //limits the timer to a max unit, returns itself
    setFocusDuration(state => state + 5);
  };
  function breakButtonDecrease() {
    if (breakDuration === 1) return; //limits the timer to a max unit, returns itself
    setBreakDuration(state => state - 1);
  };
  function breakButtonIncrease() {
    if (breakDuration === 15) return; //limits the timer to a max unit, returns itself
    setBreakDuration(state => state + 1);
  };
  function handleStop() {
    setIsTimerRunning(INITIAL_STATE.isTimerRunning);
    setSession(INITIAL_STATE.session);
  }


  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          {/*<TIMER_DISPLAY COMPOENENT WILL BE PLACED HERE />*/}
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                //add an event listener to decrease focusDuration onClick
                onClick={focusButtonDecrease}
                disabled={session}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={focusButtonIncrease}
                disabled={session}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* Displays the current Break duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={breakButtonDecrease}
                  disabled={session}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={breakButtonIncrease}
                  disabled={session}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              disabled={!session}
              onClick={handleStop}
              >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <Session session={session} currentDuration={session?.label === "Focusing" ? focusDuration : breakDuration} />
      <div>
      <PauseButtonHandler session={session} isTimerRunning={isTimerRunning} />
      </div>
      
    </div>


  );
}

export default Pomodoro;
