from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/', methods=['GET'])
def base_route():
    return jsonify({'message': 'Hii Mom!'})

@app.route('/asr', methods=['POST'])
def asr():
    audio_data = request.data  # Receive audio data from the client
    # Process the audio data using the ASR model and return the result
    result = process_audio(audio_data)  # Implement this function
    return jsonify({'transcript': result})

def process_audio(audio_data):
    # Define the ASR processing logic here, similar to the existing code
    # You can create an OnlineASRProcessor instance and use it for real-time ASR
    # Make sure to manage the state and initialization of ASR components
    result = online.process(audio_data)  # Modify this according to your ASR logic
    return result


def start_server(host, port):
    app.run(host=host, port=port)

if __name__ == '__main__':
    # Start the server on the specified host and port
    host = "0.0.0.0"
    port = 54279
    server_thread = threading.Thread(target=start_server, args=(host, port))
    server_thread.start()
