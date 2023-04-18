from flask import Flask, send_from_directory, safe_join, request
from git import Repo
import json
import os
import shutil

app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
    return serve_static('index.html')

@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/'), filename)

@app.route('/api/graph', methods=['GET'])
def api_graph():
    print(request.args.get("githuburl"))
    
    if os.path.exists("../gen/"):
        shutil.rmtree("../gen")
    
    Repo.clone_from(request.args.get("githuburl"), "../gen/")
    tree = {
        "nodes" : [
            { "id": "1", "name": ".", "val": 0 },
        ], 
        "links" : [

        ]
    }

    generateTree("../gen", tree, 2, 1)
    print(tree)
    json_object = json.dumps(tree, indent = 4)

    response = app.response_class(
        response=json_object,
        status=200,
        mimetype='application/json'
    )
    return response

def listFiles(path):
    files_and_dirs = os.listdir(path)
    files = [f for f in files_and_dirs if os.path.isfile(path+'/'+f)]
    return files

def listDirs(path):
    files_and_dirs = os.listdir(path)
    files = [f for f in files_and_dirs if not os.path.isfile(path+'/'+f)]
    return files


def generateTree(path, tree, next_id, src_id):
    directories = listDirs(path)
    files = listFiles(path)
    next_dir_id = next_id + len(files) + len(directories)
    for file in files:
        tree["nodes"].append({"id": str(next_id), "name": str(file), "val": 1})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        next_id +=1
    for directory in directories:
        tree["nodes"].append({"id": str(next_id), "name": str(directory), "val": 0})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        num_nodes_added = generateTree(path+"/"+directory, tree, next_dir_id, next_id)
        next_dir_id = next_dir_id + num_nodes_added
        next_id +=1
    return len(files) + len(directories)

if __name__ == "__main__":
    print('Angular frontend enabled on localhost port 8080')
    app.run(debug=True, host='127.0.0.1', port=8080)