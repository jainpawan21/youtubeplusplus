import flask
from flask import request
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
import string
import json
from flask_cors import CORS

def model(text):
    extra_words = list(STOP_WORDS) + list(string.punctuation) + ['\n']
    nlp = spacy.load('en_core_web_sm')
    doc = str(text)
    docx = nlp(doc)
    all_words = [word.text for word in docx]
    Freq_word = {}
    for w in all_words:
        w1 = w.lower()
        if w1 not in extra_words and w1.isalpha():
            if w1 in Freq_word.keys():
                Freq_word[w1] += 1
            else:
                Freq_word[w1] = 1
    val = sorted(Freq_word.values())
    max_freq = val[-3:]
    for word in Freq_word.keys():
        Freq_word[word] = (Freq_word[word] / max_freq[-1])
    sent_strength = {}
    for sent in docx.sents:
        for word in sent:
            if word.text.lower() in Freq_word.keys():
                if sent in sent_strength.keys():
                    sent_strength[sent] += Freq_word[word.text.lower()]
                else:
                    sent_strength[sent] = Freq_word[word.text.lower()]
            else:
                continue
    top_sentences = (sorted(sent_strength.values())[::-1])
    top30percent_sentence = int(0.3 * len(top_sentences))
    top_sent = top_sentences[:top30percent_sentence]
    summary = []
    for sent, strength in sent_strength.items():
        if strength in top_sent:
            summary.append(sent)
        else:
            continue
    summarized_text = ""
    for i in summary:
        summarized_text = summarized_text + str(i) + " "
    to_be_json={"summary":summarized_text}
    json_object=json.dumps(to_be_json)
    return json_object


app = flask.Flask(__name__)
CORS(app)
@app.route('/',methods=['POST'])
def home():
    request_data = request.get_json(force=True)
    text = str(request_data['text'])
    return model(text)
