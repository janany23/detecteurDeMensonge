#!/bin/bash
echo $1
pico2wave -l fr-FR -w ./temp/test.wav "$1"
aplay -q ./temp/test.wav
rm ./temp/test.wav
