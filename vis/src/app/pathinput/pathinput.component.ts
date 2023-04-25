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
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
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
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
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


	/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
	interface FoodNode {
		name: string;
		children?: FoodNode[];
	}


	const TREE_DATA: FoodNode[] = [
		{
		  name: 'Fruit',
		  children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
		},
		{
		  name: 'Vegetables',
		  children: [
			{
			  name: 'Green',
			  children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
			},
			{
			  name: 'Orange',
			  children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
			},
		  ],
		},
	  ];

/** Flat node with expandable and level information */
export class DynamicFlatNode {
	constructor(
	  public item: string,
	  public level = 1,
	  public expandable = false,
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
	
	  getLevel = (node: DynamicFlatNode) => node.level;
	
	  isExpandable = (node: DynamicFlatNode) => node.expandable;
	
	  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

	// treeControl = new NestedTreeControl<FileTree>(node => node.children);
	// dataSource = new MatTreeNestedDataSource<FileTree>();

	fileTree: FileTree;

	// TODO: update to filetree
	//hasChild = (_: number, node: FileTree) => !!node.children && node.children.length > 0;
	
	constructor(private graphService: GraphService, private dataService: DataService, database: DynamicDatabase) {
		this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
		this.dataSource = new DynamicDataSource(this.treeControl, database);
	
		this.dataSource.data = database.initialData();
		this.fileTree = dataService.defaultFileTree;
		// this.dataSource.data = this.fileTree.children;
		
		// this.dataService.fileTreeObservable.subscribe((data: FileTree) => {
		// 	this.fileTree = data;
		// 	this.dataSource.data = this.fileTree.children;
		// 	this.selectedPaths.clear()
		// })
	}

	// fullDatasource = [...this.sampleFileTree.children].map((item, index) => {
	// 	return { ...item, filename: item.name };
	//   });

	// Form control for the github url input
	pathInputForm = new FormGroup({
		pathInput: new FormControl(),
	});

	selectedPaths: Set<string> = new Set<string>();

	onPathCheckBoxChange(event: MatCheckboxChange, node: FileTree) {
		const path = node.path;
		if (event.checked) {
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

}
