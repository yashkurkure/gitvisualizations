from flask import Flask, send_from_directory, safe_join, request
from git import Repo
import json
import os
import shutil


all_repo_root = "../repos"

app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
    return serve_static('index.html')

@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/'), filename)

@app.route('/api/filetree', methods=['GET'])
def file_tree():
    repo_url = request.args.get("githuburl")
    tree_path = "/"
    print(f'Received url: {repo_url}')

    # Get the name of the repository.
    repo_name = repo_url.split('.git')[0].split('/')[-1]
    print(f'Repository name: {repo_name}')

    # The place where the repo would be/is cloned.
    repo_clone_path = all_repo_root + "/" + repo_name.lower() + "/"

    # Check of the all_repo_root directory exists.
    if not os.path.exists(all_repo_root):
        # if not create it.
        os.makedirs(all_repo_root)

    # Check if the repository was already cloned.
    if not os.path.exists(repo_clone_path):
        # if not lets clone it.
        print("Cloning repository...")
        Repo.clone_from(repo_url, repo_clone_path)
        print(f'Cloned repository at: {repo_clone_path}')
    else:
        print(f'Found repository at: {repo_clone_path}')
    
    tree = {
        "name" : '.',
        "path" : '.',
        "isFile": 'false',
        "children" : [],
    }

    print(f'Generating file tree...')
    generateFileTree(repo_clone_path, tree["children"])
    json_object = json.dumps(tree, indent = 4)
    print(json_object)
    print(f'Sending response to frontend...')
    response = app.response_class(
        response=json_object,
        status=200,
        mimetype='application/json'
    )
    return response

def generateFileTree(path, tree):
    directories = listDirs(path)
    files = listFiles(path)
    for directory in directories:
        node = {
            "name" : directory,
            "path" : path + "/" + directory,
            "isFile": 'true',
            "children" : [],
        }
        tree.append(node)
        generateFileTree(path+"/"+directory, node["children"])
    for file in files:
        tree.append({
            "name" : file,
            "path" : path + "/" + file,
            "isFile": 'true',
            "children" : [],
        })

@app.route('/api/graph', methods=['GET'])
def api_graph():
    
    # Get the url of the repository.
    repo_url = request.args.get("githuburl")
    tree_path = "/"
    #print(f'Received url: {repo_url}')

    # Get the name of the repository.
    repo_name = repo_url.split('.git')[0].split('/')[-1]
    #print(f'Repository name: {repo_name}')

    # The place where the repo would be/is cloned.
    repo_clone_path = all_repo_root + "/" + repo_name.lower() + "/"

    # Check of the all_repo_root directory exists.
    if not os.path.exists(all_repo_root):
        # if not create it.
        os.makedirs(all_repo_root)

    # Check if the repository was already cloned.
    if not os.path.exists(repo_clone_path):
        # if not lets clone it.
        #print("Cloning repository...")
        Repo.clone_from(repo_url, repo_clone_path)
        #print(f'Cloned repository at: {repo_clone_path}')
    #else:
        #print(f'Found repository at: {repo_clone_path}')

    path = "linux/arch/alpha/boot/tools"
    tree = {
        "nodes" : [
            { "id": "1", "name": "/", "leaf": 0 },
        ], 
        "links" : [

        ]
    }

    #print(f'Generating tree...')
    generateTreeAlongPath(path, 0, tree, 2, 1)
    json_object = json.dumps(tree, indent = 4)
    #print(json_object)
    #print(f'Sending response to frontend...')
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

def isDir(path):
    return os.path.isdir(path)

def isFile(path):
    return os.path.isfile(path)

def generateTreeAlongPath(path, level, tree, next_id, src_id):
    
    pathforlevel_list = path.split('/')[:level+1]
    pathforlevel = '/'.join(pathforlevel_list)
    #print(pathforlevel)


    if os.path.isfile(pathforlevel):
        return
    
    next_level_name = ""
    next_src_id = -1
    if(pathforlevel != path):
        next_level_name = path.split("/")[level+1]
    directories = listDirs(all_repo_root + "/" +  pathforlevel)
    files = listFiles(all_repo_root + "/" + pathforlevel)
    for file in files:
        tree["nodes"].append({"id": str(next_id), "name": str(file), "leaf": 1})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        next_id +=1
    for directory in directories:
        if directory == next_level_name:
            next_src_id = next_id
        tree["nodes"].append({"id": str(next_id), "name": str(directory), "leaf": 0})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        next_id +=1
    
    if pathforlevel == path:
        return

    generateTreeAlongPath(path, level + 1, tree, next_id, next_src_id)


def generateFullTree(path, tree, next_id, src_id):
    directories = listDirs(path)
    files = listFiles(path)
    next_dir_id = next_id + len(files) + len(directories)
    for file in files:
        tree["nodes"].append({"id": str(next_id), "name": str(file), "leaf": 1})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        next_id +=1
    for directory in directories:
        tree["nodes"].append({"id": str(next_id), "name": str(directory), "leaf": 0})
        tree["links"].append({ "source": str(src_id), "target": str(next_id) })
        num_nodes_added = generateFullTree(path+"/"+directory, tree, next_dir_id, next_id)
        next_dir_id = next_dir_id + num_nodes_added
        next_id +=1
    return len(files) + len(directories)

if __name__ == "__main__":
    print('Angular frontend enabled on localhost port 8080')
    app.run(debug=True, host='127.0.0.1', port=8080)