# spellitout

```
cd /workspace
git clone https://HarishTeens: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@github.com/HarishTeens/spellitout.git
bash setup.sh
```
https://github.com/ufal/whisper_streaming/blob/main/README.md

python3 whisper_online.py english.mp3 --min-chunk-size 1 > out.txt
python3 whisper_online.py week.mp3 -lan en --task translate > out.txt

# New Deepgram

setup ->

start server -> (password) => make 2 dg socket connections
server status API
store client_id => input, output map

socket events->

audio(client_id)
transcription() => text = {
    'en': "",
    'es': ""
}


/ => check meeting running status
/start => take password (if meeting not running)
/join => take input,output language(if meeting is running)
/view => where transcription is sent using socket events(after /start & /join come here)