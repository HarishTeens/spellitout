import pyaudio
import socket

# Define audio parameters
audio_format = pyaudio.paInt16
channels = 1
sample_rate = 16000
chunk_size = 1024

server_address = "81.166.173.12"
server_port = 12139


audio = pyaudio.PyAudio()


client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_address, server_port))

client_socket.send(b"Hello, Server! From Python")

stream = audio.open(format=audio_format, channels=channels,
                    rate=sample_rate, input=True, frames_per_buffer=chunk_size)

print("Recording and streaming audio...")

try:
    while True:
        audio_data = stream.read(chunk_size)
        client_socket.sendall(audio_data)

        server_response = client_socket.recv(1024)
        print("Server response:", server_response.decode('utf-8'))


except KeyboardInterrupt:
    print("Recording and streaming stopped.")

# Close the audio stream and the socket
stream.stop_stream()
stream.close()
client_socket.close()
audio.terminate()
