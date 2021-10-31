import React from "react"
import { minutesToDuration, secondsToDuration } from "../utils/duration";



export default function Session({ session, currentDuration }) {
    if (!session) return null;
//create a variable to store the quotient of timeRemaining divided by currentDuration
const sliderIncrease = ((session?.timeRemaining) / (currentDuration * 60)).toFixed(2)*100;
//console.log(100 - sliderIncrease); //needs to be converted to a percentage and passed into aria-valuenow and style width
return (
    
    <div>
    {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}

        <div className="row mb-2">
            <div className="col">
                {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
                <h2 data-testid="session-title">
                    {session?.label} for {minutesToDuration(currentDuration)} minutes
                </h2>
                {/* TODO: Update message below correctly format the time remaining in the current session */}
                <p className="lead" data-testid="session-sub-title">
                    {secondsToDuration(session?.timeRemaining)} remaining
                </p>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col">
                <div className="progress" style={{ height: "20px" }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow= {100 - sliderIncrease} // timeRemaining divided by currentDuration, inversely correlated
                        style={{ width: `${100 - sliderIncrease}%` }} // TODO: Increase width % as elapsed time increases
                    />
                </div>
            </div>
        </div>
    </div>

    
        
)
}