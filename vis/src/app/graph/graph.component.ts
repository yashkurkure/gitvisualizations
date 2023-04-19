
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import ForceGraph3D from '3d-force-graph';
import { BooleanKeyframeTrack } from 'three';
import { GraphDataRaw, GraphData, Node, NodeRaw, Link, LinkRaw } from '../types';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

	visibleNodes: Node[] = []
	visibleLinks: Link[] = []

	nodesById: any

	rawData!:GraphDataRaw;

	data!: GraphData 

	graph!: any

	sampleData: GraphDataRaw = {
		nodes: [
			{id: 1, name: ".", leaf: 0},
			{id: 2, name: "dir1", leaf: 0},
			{id: 3, name: "dir2", leaf: 0},
			{id: 4, name: "dir3", leaf: 0},
			{id: 5, name: "file1", leaf: 1},
			{id: 6, name: "file2", leaf: 1},
			{id: 7, name: "file3", leaf: 1},
			{id: 8, name: "file4", leaf: 1},
		],
		links: [
			{source: 1, target: 2},
			{source: 1, target: 3},
			{source: 1, target: 5},

			{source: 2, target: 6},

			{source: 3, target: 7},
			{source: 3, target: 4},

			{source: 4, target: 8},
		]
	}
		
	// Constructor.
	constructor(private dataService: DataService) {
	}

	//On Initialization of the component.
	ngOnInit(): void {

		this.dataService.currentGraphData.subscribe((obs: Observable<GraphDataRaw>)=>{
			obs.subscribe((gData: GraphDataRaw)=>{
				this.rawData = gData
				this.loadGraph()
			})
		});
	}

	loadGraph(): void {

		// Get the raw data
		//this.rawData = this.sampleData;
		//console.log(this.rawData)

		// this.graph = ForceGraph3D()(document.getElementById('graph')!)
		//  .graphData(this.rawData)
		
		// console.log(this.sampleData)

		// Add the required attr to make it collapsable
		this.data = this.dataCollapsableGraph(this.rawData)
		console.log("DATA: ", this.data)
		
		// Get the tree that is visiable
		const prunedTree = this.getPrunedTree(this.data)
		console.log("PRUNED: ", JSON.stringify(prunedTree))

		this.graph = ForceGraph3D()(document.getElementById('graph')!)
		.graphData(prunedTree)
		.onNodeClick((node: Object, event: MouseEvent) => {

			const node2: Node = node as Node
			if(node2.childLinks.length) {
				node2.collapsed = !node2.collapsed;
				const prunedData = this.getPrunedTree(this.data)
				this.graph.graphData(prunedData)
			}

		})

	}

	dataCollapsableGraph(rawData: GraphDataRaw): GraphData {

		
		const nodes: Node[] = rawData.nodes.map((node: NodeRaw)=>{

			// get the children of each node
			const childlinks: Link[] = rawData.links.filter((element: LinkRaw, index: number, array: LinkRaw[]) => {
				return (node.id == element.source)
			})

			const new_node: Node = {
				id: node.id,
				name: node.name,
				leaf: node.leaf,
				collapsed: node.id !== 1,
				childLinks: childlinks
			}
			
			return new_node
		})
		const new_data: GraphData = {nodes: nodes, links: this.rawData.links}
		this.nodesById = Object.fromEntries(new_data.nodes.map(node => [node.id, node]));

		return new_data;
	}

	getPrunedTree(data: GraphData): GraphData {

		const rootId = 1;

		this.visibleNodes = []
		this.visibleLinks = []
		this.updateVisibleTree(this.nodesById[rootId], this.nodesById)

		return {nodes: this.visibleNodes, links: this.visibleLinks}
	}

	updateVisibleTree(node: Node, nodesById: any): void {

		console.log("updateVis: N ", node)
		this.visibleNodes.push(node)

		if (node.collapsed) return;

		this.visibleLinks.push(...node.childLinks);

		console.log("updateVis: AN ", nodesById)
		const children: Node[] = node.childLinks.map(link => {
			console.log("\t map: ", link.target)
			if(typeof link.target === 'object')
				return link.target
			else
				return nodesById[link.target]
		})
		console.log("updateVis: C ", children)

		children.forEach((cnode: Node) =>{
			this.updateVisibleTree(cnode, nodesById)
		});
		
	}



}


// {
// 	"nodes":
// 	[
// 		{"id":1,"name":".","leaf":0,"collapsed":false,"childLinks":[{"source":1,"target":2},{"source":1,"target":3},{"source":1,"target":5}]},
// 		{"id":2,"name":"dir1","leaf":0,"collapsed":true,"childLinks":[{"source":2,"target":6}]},
// 		{"id":3,"name":"dir2","leaf":0,"collapsed":true,"childLinks":[{"source":3,"target":7},{"source":3,"target":4}]},
// 		{"id":5,"name":"file1","leaf":1,"collapsed":true,"childLinks":[]}
// 	],
	
// 	"links":
// 	[
// 		{"source":1,"target":2},
// 		{"source":1,"target":3},
// 		{"source":1,"target":5}
// 	]
// }