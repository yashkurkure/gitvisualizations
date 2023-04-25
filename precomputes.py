import json
import os
from git import Repo


all_repo_root = "../repos"

def listFiles(path):
    files_and_dirs = os.listdir(path)
    files = [f for f in files_and_dirs if os.path.isfile(path+'/'+f)]
    return files

def listDirs(path):
    files_and_dirs = os.listdir(path)
    dirs = [f for f in files_and_dirs if not os.path.isfile(path+'/'+f)]
    return dirs

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

def precomputeCloneRepository(repo_url):
    
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
        Repo.clone_from(repo_url, repo_clone_path)


def precomputeFileTree(repo_url):

    # Get the name of the repository.
    repo_name = repo_url.split('.git')[0].split('/')[-1]
    #print(f'Repository name: {repo_name}')

    # The place where the repo would be/is cloned.
    repo_clone_path = all_repo_root + "/" + repo_name.lower() + "/"
    
    tree = {
        "name" : '.',
        "path" : '.',
        "isFile": 0,
        "children" : [],
    }

    #print(f'Generating file tree...')
    generateFileTree(repo_clone_path,"",tree["children"])
    return tree


def main():
    url = 'https://github.com/torvalds/linux.git'
    repo_name = url.split('.git')[0].split('/')[-1]
    precomputeCloneRepository(url)
    tree = precomputeFileTree(url)
    # Serializing json
    json_object = json.dumps(tree, indent=4)
 
    # Writing to sample.json
    with open(all_repo_root + "/" + repo_name + ".filetree", "w") as outfile:
        outfile.write(json_object)

if __name__ == "__main__":
    main()
