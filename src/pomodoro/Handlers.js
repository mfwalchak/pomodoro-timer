import React from "react";
//refactor focus & break buttons to increment and decrement regardless of button 

//pause button
function PauseButtonHandler ({ session, isTimerRunning }){
    if (!session || (session.timeRemaining > 0 && isTimerRunning === true)) {
        return null;
    }   
        return (
        <div>
            <h2>PAUSED</h2>
        </div>
    )

}

export default PauseButtonHandler;