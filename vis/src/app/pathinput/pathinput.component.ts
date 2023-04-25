import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTree } from '../types';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { DataService } from '../data.service';
import { MatCheckboxChange } from '@angular/material/checkbox';


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
@Component({
  selector: 'app-pathinput',
  templateUrl: './pathinput.component.html',
  styleUrls: ['./pathinput.component.css']
})
export class PathinputComponent implements OnInit{

	treeControl = new NestedTreeControl<FileTree>(node => node.children);
	dataSource = new MatTreeNestedDataSource<FileTree>();

	fileTree: FileTree;


	sampleFileTree: FileTree = {
		name: '.',
		path: '.',
		isFile: false,
		children: [
			{
				name: 'dir1',
				path: '/dir1',
				isFile: false,
				children: [
					{
						name: 'file2',
						path: '/dir1/file2',
						isFile: true,
						children: []
		
					},
					{
						name: 'file3',
						path: '/dir1/file3',
						isFile: true,
						children: []
		
					},
					{
						name: 'file21',
						path: '/dir1/file21',
						isFile: true,
						children: []
		
					},
					{
						name: 'file32',
						path: '/dir1/file32',
						isFile: true,
						children: []
		
					},
					{
						name: 'file23',
						path: '/dir1/file23',
						isFile: true,
						children: []
		
					},
					{
						name: 'file34',
						path: '/dir1/file34',
						isFile: true,
						children: []
		
					},
					{
						name: 'file25',
						path: '/dir1/file25',
						isFile: true,
						children: []
		
					},
					{
						name: 'file36',
						path: '/dir1/file36',
						isFile: true,
						children: []
		
					}
				]

			},
			{
				name: 'dir2',
				path: '/dir2',
				isFile: false,
				children: [

					{
						name: 'file2',
						path: '/dir2/file2',
						isFile: true,
						children: []
		
					}
				]

			},
			{
				name: 'dir2',
				path: '/dir2',
				isFile: false,
				children: [
					{
						name: 'dir2',
						path: '/dir2',
						isFile: false,
						children: [
		
							{
								name: 'file2',
								path: '/dir2/file2',
								isFile: true,
								children: []
				
							}
						]
		
					},
					{
						name: 'file2',
						path: '/dir2/file2',
						isFile: true,
						children: [
							{
								name: 'dir2',
								path: '/dir2',
								isFile: false,
								children: [
									{
										name: 'dir2',
										path: '/dir2',
										isFile: false,
										children: [
						
											{
												name: 'file2',
												path: '/dir2/file2',
												isFile: true,
												children: []
								
											}
										]
						
									},
									{
										name: 'file2',
										path: '/dir2/file2',
										isFile: true,
										children: []
						
									}
								]
				
							},
						]
		
					}
				]

			},
			{
				name: 'file1',
				path: '/file1',
				isFile: true,
				children: []

			}
			,
			{
				name: 'file1',
				path: '/file1',
				isFile: true,
				children: []

			}
			,
			{
				name: 'file1',
				path: '/file1',
				isFile: true,
				children: []

			}
			,
			{
				name: 'file1',
				path: '/file1',
				isFile: true,
				children: []

			}
		]

	}

	// TODO: update to filetree
	hasChild = (_: number, node: FileTree) => !!node.children && node.children.length > 0;
	
	constructor(private graphService: GraphService, private dataService: DataService) {
		this.fileTree = dataService.defaultFileTree;
		this.dataSource.data = this.fileTree.children;
		
		this.dataService.fileTreeObservable.subscribe((data: FileTree) => {
			this.fileTree = data;
			this.dataSource.data = this.fileTree.children;
		})
	}

	fullDatasource = [...this.sampleFileTree.children].map((item, index) => {
		return { ...item, filename: item.name };
	  });

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
