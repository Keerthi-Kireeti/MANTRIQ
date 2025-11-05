from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/mantriq', methods=['POST'])
def mantriq_api():
    data = request.json
    mode = data.get('mode', 'explain')
    code = data.get('code', '')
    
    if not code:
        return jsonify({"error": "Code is required"}), 400
    
    def generate():
        try:
            script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vector_streaming.py")
            process = subprocess.Popen(
                [sys.executable, script_path, mode, code],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1
            )

            for line in iter(process.stdout.readline, ''):
                yield line
            
            process.stdout.close()
            process.wait()

        except Exception as e:
            yield f"Error: {str(e)}"

    return Response(generate(), mimetype='text/plain')

@app.route('/api/read-file', methods=['POST'])
def read_file():
    data = request.json
    file_path = data.get('file_path')

    if not file_path:
        return jsonify({"error": "File path is required"}), 400

    try:
        with open(file_path, 'r') as f:
            content = f.read()
        return jsonify({"content": content})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/save-file", methods=["POST"])
def save_file():
    data = request.get_json()
    file_path = data.get("file_path")
    content = data.get("content")

    if not file_path or content is None:
        return jsonify({"error": "Missing file_path or content"}), 400

    try:
        with open(file_path, "w") as f:
            f.write(content)
        return jsonify({"message": "File saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)