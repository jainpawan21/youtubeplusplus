import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './YouTube.css';
import Grid from '@material-ui/core/Grid'

function YouTubeVideo(props) {
    return (
        <Grid container>
            <YouTube
                videoId={string}
                id={string}
                className={string}
                containerClassName={string}
                opts={obj}
                onReady={func}
                onPlay={func}
                onPause={func}
                onEnd={func}
                onError={func}
                onStateChange={func}
                onPlaybackRateChange={func}
                onPlaybackQualityChange={func}
            />

        </Grid>
    );
}

export default YouTubeVideo;