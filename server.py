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
    print("Received GET")
    repo_url = request.args.get("githuburl")
    tree_path = "/"
    print(f'Received url: {repo_url}')

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
    
    tree = {
        "name" : '.',
        "path" : '.',
        "isFile": 0,
        "children" : [],
    }

    #print(f'Generating file tree...')
    generateFileTree(repo_clone_path,"",tree["children"])
    json_object = json.dumps(tree, indent = 4)
    #print(json_object)
    #print(f'Sending response to frontend...')
    response = app.response_class(
        response=json_object,
        status=200,
        mimetype='application/json'
    )
    return response

# Generate using DFS
def generateGraphData(path, tree, src_id, next_id): 

    if isFile(path):
        return next_id
    
    for entity in os.listdir(path):
        if entity == '.git':
            continue
        tree["nodes"].append(
            {
                "id": next_id,
                "name": str(entity),
                "leaf": 1 if os.path.isfile(path+ "/" + entity) else 0,
                "path": path + "/" + entity
            }
        )
        tree["links"].append({ "source": src_id, "target": next_id })
        next_id  = generateGraphData(path + "/" + entity, tree, next_id, next_id + 1)
    
    return next_id

# Generate using DFS
def generatePathTree(paths, repoPath):

    node_id_map = {}
    nodes = set({(0, "/", 0, "")})
    links = set({})
    result = {"nodes": [], "links": []}

    next_id = 1
    src_id = 0

    for path in paths:
        prev_node_id = src_id
        prev_node_path = ""
        nodepath = ""
        for nodename in path.split('/'):

            # Include everything below
            if(nodename == '*'):
                next_id = generateGraphData( repoPath + prev_node_path, result, prev_node_id, next_id)


            if(nodename == ''):
                continue
            
            # Case the node was already added
            if nodename in node_id_map:
                nodeid = node_id_map[nodename]
                # the prev id for the next nodes should be the id of this node
                prev_node_id = nodeid
                continue
            prev_node_path = nodepath
            nodepath = "/" + nodename
            nodeData = (next_id, nodename, 1 if os.path.isfile(nodepath) else 0, nodepath)
            linkData = (prev_node_id, next_id)
            nodes.add(nodeData)
            node_id_map[nodename] = next_id
            links.add(linkData)
            prev_node_id = next_id
            next_id+=1
    

    for nodedata in nodes:
        result['nodes'].append({
                "id": nodedata[0],
                "name": nodedata[1],
                "leaf": nodedata[2],
                "path": nodedata[3]
            })

    for linkdata in links:
        result['links'].append({
                "source": linkdata[0],
                "target": linkdata[1]
            })


    return result

def generateFileTree(path, parentPath, tree):
    directories = listDirs(path)
    files = listFiles(path)
    for directory in directories:
        if (directory == '.git'):
            continue
        node = {
            "name" : directory,
            "path" : parentPath + "/" + directory,
            "isFile": 0,
            "children" : [],
        }
        tree.append(node)
        generateFileTree(path+"/"+directory, node["path"] ,node["children"])
    for file in files:
        tree.append({
            "name" : file,
            "path" : parentPath + "/" + file,
            "isFile": 1,
            "children" : [],
        })

@app.route('/api/graph', methods=['POST'])
def api_graph():
    content = request.get_json()
    print("Received POST: ", content)
    
    # Get the url of the repository.
    repo_url = content['repourl']
    paths = content['paths']

    # Get the name of the repository.
    repo_name = repo_url.split('.git')[0].split('/')[-1]
    print(f'Repository name: {repo_name}')

    # The place where the repo would be/is cloned.
    repo_clone_path = all_repo_root + "/" + repo_name.lower()

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

    # path = "linux/arch/alpha/boot/tools"
    tree = {
        "nodes" : [
            { "id": 1, "name": "/", "leaf": 0 },
        ], 
        "links" : [

        ]
    }

    # Generate the full tree and save it
    #generateFullTree(repo_clone_path, tree, 2, 1)
    generateGraphData(repo_clone_path, tree, 1, 2)
    print(f'Generating tree...')
    #generateTreeAlongPath(path, 0, tree, 2, 1)
    json_object = json.dumps(generatePathTree(paths, repo_clone_path), indent = 4)
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
    dirs = [f for f in files_and_dirs if not os.path.isfile(path+'/'+f)]
    return dirs

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
        tree["nodes"].append({"id": next_id, "name": str(file), "val": 1})
        tree["links"].append({ "source": src_id, "target": next_id })
        next_id +=1
    for directory in directories:
        if directory == '.git':
            continue
        tree["nodes"].append({"id": next_id, "name": str(directory), "val": 0})
        tree["links"].append({ "source": src_id, "target": next_id })
        num_nodes_added = generateFullTree(path+"/"+directory, tree, next_dir_id, next_id)
        next_dir_id = next_dir_id + num_nodes_added
        next_id +=1
    return len(files) + len(directories)

if __name__ == "__main__":
    print('Angular frontend enabled on localhost port 8080')
    app.run(debug=True, host='127.0.0.1', port=8080)