import { Component, Injectable, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTree } from '../types';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { DataService } from '../data.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {CollectionViewer, SelectionChange, DataSource} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  nodeMap = new Map<string, FileTree>();
//   fileTree!: FileTree;
  fileTree: FileTree[] = [
		{name: "file1", isFile: false, path: "/file1", children: []},
		{name: "file2", isFile: false, path: "/file2", children: []},
		{name: "file3", isFile: false, path: "/file3", children: []},
		{name: "file4", isFile: false, path: "/file4", children: []},
		{name: "dir5", isFile: false, path: "/dir5", children: [
				{name: "file1", isFile: false, path: "/file1", children: []},
				{name: "file2", isFile: false, path: "/file2", children: []},
				{name: "file3", isFile: false, path: "/file3", children: []},
				{name: "file4", isFile: false, path: "/file4", children: []},
			]}
	];

//   rootLevelNodes!: FileTree[];


  setFileTree(fileTree: FileTree): void {
	this.fileTree = fileTree.children;
  }

  initDatabase(fileTree: FileTree[]): void {

	fileTree.forEach((tree: FileTree) => {
		this.nodeMap.set(tree.name, tree);
		this.initDatabase(tree.children);
	});
  }


  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
	this.initDatabase(this.fileTree);
    const root = this.fileTree.map(tree => new DynamicFlatNode(tree.name, 0, tree.children.length == 0? false: true));
	console.log("Root nodes: ", root)
	return root;
  }

  getChildrenNames(node: string): string[] | undefined {
    return this.nodeMap.get(node)!.children.map(tree=> tree.name);
  }

  isExpandable(node: string): boolean {

	let result = false;

	let fileTree = this.nodeMap.get(node);

	if(!fileTree) result = false;
	else {
		if (fileTree.children.length == 0) {
			result = false;
		} else {
			result = true;
		}
	}

	console.log(node, "is expandable: ",result)
	return result;
  }
}


export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this._database.getChildrenNames(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name), true),
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}


/** Flat node with expandable and level information */
export class DynamicFlatNode {
	constructor(
	  public item: string,
	  public level = 1,
	  public expandable = false,
	  public isChecked = false,
	  public isLoading = false,
	) {}
  }

  
@Component({
  selector: 'app-pathinput',
  templateUrl: './pathinput.component.html',
  styleUrls: ['./pathinput.component.css']
})
export class PathinputComponent implements OnInit{

	  treeControl!: FlatTreeControl<DynamicFlatNode>;
	
	  dataSource!: DynamicDataSource;
	  dataSourceBS!: BehaviorSubject<DynamicDataSource>
	
	  getLevel = (node: DynamicFlatNode) => node.level;
	
	  isExpandable = (node: DynamicFlatNode) => node.expandable;
	
	  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

	// treeControl = new NestedTreeControl<FileTree>(node => node.children);
	// dataSource = new MatTreeNestedDataSource<FileTree>();

	fileTree: FileTree;

	// TODO: update to filetree
	//hasChild = (_: number, node: FileTree) => !!node.children && node.children.length > 0;
	
	constructor(private graphService: GraphService, private dataService: DataService, private database: DynamicDatabase) {
		this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);

		

		// database.setFileTree(this.dataService.defaultFileTree)
		this.dataSource = new DynamicDataSource(this.treeControl, database);
		this.dataSourceBS = new BehaviorSubject<DynamicDataSource> (this.dataSource);
		
		this.dataSource.data = database.initialData();
		this.fileTree = dataService.defaultFileTree;
		// this.dataSource.data = this.fileTree.children;
		
		this.dataService.fileTreeObservable.subscribe((data: FileTree) => {
			this.fileTree = data;
			// this.dataSource.data = this.fileTree.children;
			database.setFileTree(this.fileTree)
			this.dataSourceBS.next(new DynamicDataSource(this.treeControl, database));
			this.selectedPaths.clear()
		})

		this.dataSourceBS.subscribe((dataSource) => {
			console.log("dataSrouceBS subscribe change")
			this.dataSource = dataSource
			this.dataSource.data = database.initialData();
			this.treeControl.collapseAll();
		});
	}


	// Form control for the github url input
	pathInputForm = new FormGroup({
		pathInput: new FormControl(),
	});

	selectedPaths: Set<string> = new Set<string>();

	onPathCheckBoxChange(event: MatCheckboxChange, nodeF: DynamicFlatNode) {

		let node :FileTree = this.database.nodeMap.get(nodeF.item)!

		const path = node.path;
		if (event.checked) {

			nodeF.isChecked = true;
			//console.log("Add path", path)
			//this.selectedPaths.add(path);
			// if the node is a directory select the files in it
			console.log(node.isFile)
			if(!node.isFile){
				console.log("Adding directory from paths")
				this.selectedPaths.add(path + "/*");
			} else {
				this.selectedPaths.add(path);
			}
		}
		else {
			nodeF.isChecked = false;
			//console.log("Remove path", path)
			//this.selectedPaths.delete(path);
			console.log(node.isFile)
			if(!node.isFile){
				console.log("Removing directory from paths")
				this.selectedPaths.delete(path + "/*");
			} else {
				this.selectedPaths.delete(path);
			}
			// // if the node is a directory deselect the files in it
			// if(!node.isFile){
			// 	node.children.forEach((child: FileTree) => {
			// 		this.selectedPaths.delete(child.path);
			// 	})
			// }
		}
		this.updateGraphPaths()

	}
	
	


	updateGraphPaths() {
		console.log("Loading graph from paths")
		console.log("Paths to load: ", Array.from(this.selectedPaths.values()));
		this.dataService.updateGraphPaths( Array.from(this.selectedPaths.values()));
	}

	ngOnInit(): void {
		
	}

	getCheckboxValue(nodeF: DynamicFlatNode): boolean {

		let node :FileTree = this.database.nodeMap.get(nodeF.item)!

		let path = node.path;

		if(this.selectedPaths.has(path)) {
			return true
		}
		else {
			return false
		}

	}

}
