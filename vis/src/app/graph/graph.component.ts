
import { Component, OnInit, HostListener} from '@angular/core';
import { DataService } from '../data.service';
import ForceGraph3D from '3d-force-graph';
import { BooleanKeyframeTrack } from 'three';
import { GraphDataRaw, GraphData, Node, NodeRaw, Link, LinkRaw, GraphViewConfig } from '../types';
import { Observable } from 'rxjs';
import * as THREE from "three";
import * as d3 from "d3";
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender'
import { Text } from "troika-three-text";
import { GraphService } from '../graph.service';

// TODO (Mouse events): https://fireflysemantics.medium.com/tracking-mouse-events-with-hostlistener-26dcc092692
// TODO (THREE selection): https://github.com/mrdoob/three.js/blob/master/examples/misc_boxselection.html
// TODO (ray castig)



@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

	// current graph view config
	graphViewConfig: GraphViewConfig;

	selectedFiles_txt = "None selected";
	selectedFiles = new Set();
	highlightNodes = new Set();
	hoverNode!: Node | null;
	visibleNodes: Node[] = []
	visibleLinks: Link[] = []
	visiblePath = "."

	camera!: THREE.Camera
	renderer!: THREE.Renderer
	canvas!: HTMLCanvasElement
	scene!: THREE.Scene

	nodesById: any

	data: GraphDataRaw

	graph!: any


    updateHighlight() {
      // trigger update of highlighted objects in scene
      this.graph
        .nodeColor(this.graph.nodeColor())
    }
		
	// Constructor.
	constructor(private dataService: DataService, private graphService: GraphService) {
		
		// Initialize the grpah data
		this.data = this.dataService.defualtGraphDataRaw;

		// Initialize the graph config
		this.graphViewConfig = this.graphService.defualtGraphViewConfig;
	}

	//On Initialization of the component.
	ngOnInit(): void {

		// Subscribe to graph view config
		this.graphService
		.graphViewConfigObservable
		.subscribe((newgvc: GraphViewConfig) => {
			console.log("Updating graph with new config:", newgvc.viewValue)
			if(this.graph) {
				if (newgvc.value == 'none') {
					this.graph.dagMode(null);
				}
				else {
					this.graph.dagMode(newgvc.value)
				}
			}
		})

		// Subscribe to the graph data raw
		this.dataService.graphDataRawObservable.subscribe((data: GraphDataRaw) => {
			this.data = data;
			console.log(this.data)
			this.loadGraph();
		})
	}

	// changeNodeColor(node : Node): void {

	// 	this.highlightNodes.has(node) ? node === this.hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)'
	// }

	loadGraph(): void {
		
		this.graph = ForceGraph3D()
		(document.getElementById('graph')!)
		// .dagLevelDistance(40)
		// .nodeThreeObject(node2 => {

		// 	const node: Node = node2 as Node
		// 	const text = new Text();
		// 	Object.assign(text, {
		// 	text: node.name,
		// 	fontSize: 2,
		// 	});
		// 	return text

		//   })
		// .nodeThreeObjectExtend(true)
		// .onNodeClick((node: Object, event: MouseEvent) => {
		// 	const node2: Node = node as Node
		// 	if(node2.childLinks.length) {
		// 		node2.collapsed = !node2.collapsed;
		// 		const prunedData = this.getPrunedTree(this.data)
		// 		this.graph.graphData(prunedData)
		// 	}

		// })
		//.nodeColor(node => this.highlightNodes.has(node) ? node === this.hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)')
		// .onNodeHover(node2 => {

		// 	const node: Node = node2 as Node

		// // no state change
		// if ((!node && !this.highlightNodes.size) || (node && this.hoverNode === node)) return;

		
		// if (node) {
		// 	if (this.highlightNodes.has(node)) {
		// 		this.highlightNodes.delete(node)
		// 		this.updateSelectedFiles(this.highlightNodes)
		// 	}
		// 	else {
		// 		this.highlightNodes.add(node);
		// 		this.updateSelectedFiles(this.highlightNodes)
		// 	}
		// }

		// this.hoverNode = node || null;

		// this.updateHighlight();
		// })
		.graphData(this.dataService.currentGraphDataRaw)

	}

	// dataCollapsableGraph(rawData: GraphDataRaw): GraphData {

		
	// 	const nodes: Node[] = rawData.nodes.map((node: NodeRaw)=>{

	// 		// get the children of each node
	// 		const childlinks: Link[] = rawData.links.filter((element: LinkRaw, index: number, array: LinkRaw[]) => {
	// 			return (node.id == element.source)
	// 		})

	// 		const new_node: Node = {
	// 			id: node.id,
	// 			name: node.name,
	// 			leaf: node.leaf,
	// 			collapsed: node.id !== 1,
	// 			childLinks: childlinks
	// 		}
			
	// 		return new_node
	// 	})
	// 	const new_data: GraphData = {nodes: nodes, links: this.rawData.links}
	// 	this.nodesById = Object.fromEntries(new_data.nodes.map(node => [node.id, node]));

	// 	return new_data;
	// }

	// getPrunedTree(data: GraphData): GraphData {

	// 	const rootId = 1;

	// 	this.visibleNodes = []
	// 	this.visibleLinks = []
	// 	this.updateVisibleTree(this.nodesById[rootId], this.nodesById)

	// 	return {nodes: this.visibleNodes, links: this.visibleLinks}
	// }

	// updateVisibleTree(node: Node, nodesById: any): void {

	// 	//console.log("updateVis: N ", node)
	// 	this.visibleNodes.push(node)

	// 	if (node.collapsed) return;

	// 	this.visibleLinks.push(...node.childLinks);

	// 	//console.log("updateVis: AN ", nodesById)
	// 	const children: Node[] = node.childLinks.map(link => {
	// 		//console.log("\t map: ", link.target)
	// 		if(typeof link.target === 'object')
	// 			return link.target
	// 		else
	// 			return nodesById[link.target]
	// 	})
	// 	//console.log("updateVis: C ", children)

	// 	children.forEach((cnode: Node) =>{
	// 		this.updateVisibleTree(cnode, nodesById)
	// 	});
		
	// }

	// updateSelectedFiles(s: Set<any>) {

	// 	var txt = ""
	// 	s.forEach((node: Node) =>{
	// 		txt = txt + node.name + ", "
	// 	})
	// 	this.dataService.updateSelectedFiles(txt)

	// }

	// getPrunedTreeByPath(data: GraphDataRaw, path: string): GraphDataRaw {

	// 	// Get the nodes my name
	// 	const nodesByName = data.nodes.forEach((node: NodeRaw) => {


			
	// 	});


	// 	this.visibleLinks = []
	// 	this.visibleNodes = []
		
	// 	const files_dirs = this.parsePath(path);
	// 	// files_dirs.forEach()

	// 	return data
	// }

	// parsePath(path: string): string[] {
	// 	let splits = path.split('/');

	// 	return splits
	// }
}
