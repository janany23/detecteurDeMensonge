#!/bin/bash

sleep 2
aplay -q ./temp/startAnswer.wav

echo "Recording response for question ID: $1."

arecord -D "plughw:1,0" -d 5 ./responseAudio/$1.wav

echo "Done"
