import flask
import json
from flask import request
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)
@app.route('/', methods=['GET'])
def home():
    video_id = request.args['video_id']
    keyword = request.args['keyword']
    x = YouTubeTranscriptApi.get_transcript(video_id)
    if(keyword=='none'):
        str1=''
        for each in x:
            y = each['text'].split()
            for word in y:
                str1+=word + ' '
        dic = {'text':str1}
        json_out = json.dumps(dic)
        try:
            return json_out
        except:
            return 'Video Not found or Subtitles not present for the video!' 
    else:
        time=[]
        unique_time = []
        for each in x:
            tokens = each['text'].split()
            for word in tokens:
                if(word==keyword):
                    time.append(each['start'])
        for each in time:
            if each not in unique_time:
                unique_time.append(each)
        if(len(unique_time)==0):
            return 'Keyword not found'
        else:
            json_out = json.dumps(unique_time)
            return json_out

