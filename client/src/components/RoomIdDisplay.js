import React from 'react';
import Chip from '@material-ui/core/Chip';


function RoomIdDisplay(props) {
    return (
        <div>
            <Chip label={(props.roomId) ? props.roomId : "Wait for Room ID to generate"} />
        </div>
    )
}

export default RoomIdDisplay;
