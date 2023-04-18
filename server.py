from flask import Flask, send_from_directory, safe_join
from git import Repo

app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
    return serve_static('index.html')

@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/'), filename)

@app.route('/api/graph', methods=['GET'])
def api_graph():
    print("Yay this worked!")
    return "Noting yet"

if __name__ == "__main__":
    print('Angular frontend enabled on localhost port 8080')
    app.run(debug=True, host='127.0.0.1', port=8080)