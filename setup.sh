#!/bin/bash

# Check if pip is installed
if ! [ -x "$(command -v pip)" ]; then
  echo "Error: pip is not installed. Please install pip first."
  exit 1
fi

# Install librosa
pip install librosa

# Install faster-whisper
pip install faster-whisper

# Install opus-fast-mosestokenizer
pip install opus-fast-mosestokenizer

echo "Packages installed successfully."