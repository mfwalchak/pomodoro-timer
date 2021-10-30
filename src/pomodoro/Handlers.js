import React from "react";
import isTimerRunning from "./Pomodoro"
//refactor focus & break buttons to increment and decrement regardless of button 

//pause button
function pauseButtonHandler ({ session }){
    if (session.timeRemaining > 0) {
        if (isTimerRunning) {
            return null;
        } else return (
                <div>
                    <h2>PAUSED</h2>
                </div>
            )
    }
}


export default pauseButtonHandler;