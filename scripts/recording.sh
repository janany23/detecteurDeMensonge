#!/bin/bash

echo “Recording response for question ID: $1. Press Ctrl+C to Stop.”

arecord -D "plughw:1,0" -d 10 ../responseAudio/$1.wav

echo “Done"
