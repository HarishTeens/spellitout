# type: ignore
import asyncio
import websockets
import socket
import pyaudio
import numpy as np

CHUNK_SIZE = 1024

audio = pyaudio.PyAudio()
stream = audio.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    output=True,
                    frames_per_buffer=CHUNK_SIZE)

def init_whisper_server():
    server_address = "210.203.214.230"
    server_port = 55991
    
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_address, server_port))
    
    return client_socket

whisper_server = init_whisper_server()
async def audio_stream(websocket, path):
    try:
        while True:
            audio_data = await websocket.recv()
            print('audio data', audio_data[:10], len(audio_data))
            if not audio_data:
                break  # Handle disconnection or end of the audio stream
            # Process the audio_data
            whisper_server.sendall(audio_data)
            
    except websockets.exceptions.ConnectionClosedError:
        print("Client disconnected")


def main():
    start_server = websockets.serve(audio_stream, "localhost", 5001)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
    
main()