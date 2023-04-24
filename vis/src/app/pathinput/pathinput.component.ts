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

	// Path List
	//selectedPathsQuery: Set<string> = new Set(['A']);
	selectedPathsQuery: string[] = ['A'];
	loadedpaths: Set<string> = new Set(['A', 'B', 'C']);

	// Query List
	selectedFilesDirsQuery: string[] = ["A"]
	loadedFileDirs: string[] = ["A", "B" , "C"]


	// Handler for path list selection change
	onPathSelectionChanged(event: any) {
		console.log(this.selectedPathsQuery);
	}

	onFilesDirSelectionChanged(event: any) {
		
	}

	// Handler for add path button
	onLoadPath(event: any) {

		// Get the input from the form field
		const path: string = this.pathInputForm.get('pathInput')!.value;

		// Check if the path is already there:
		
		
	}

	onPathCheckBoxChange(event: MatCheckboxChange, node: FileTree) {
		const path = node.path;
		if (event.checked) {
			console.log("Add path", path)
		}
		else {
			console.log("Remove path", path)
		}

	}

	ngOnInit(): void {
		
	}

}
