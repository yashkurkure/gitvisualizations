
import { Component, OnInit, HostListener} from '@angular/core';
import { DataService } from '../data.service';
import ForceGraph3D from '3d-force-graph';
import { BooleanKeyframeTrack } from 'three';
import { GraphDataRaw, GraphData, Node, NodeRaw, Link, LinkRaw } from '../types';
import { Observable } from 'rxjs';
import * as THREE from "three";
import * as d3 from "d3";
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender'
import { Text } from "troika-three-text";

// TODO (Mouse events): https://fireflysemantics.medium.com/tracking-mouse-events-with-hostlistener-26dcc092692
// TODO (THREE selection): https://github.com/mrdoob/three.js/blob/master/examples/misc_boxselection.html
// TODO (ray castig)



@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {



	highlightNodes = new Set();
	hoverNode!: Node | null;
	visibleNodes: Node[] = []
	visibleLinks: Link[] = []

	camera!: THREE.Camera
	renderer!: THREE.Renderer
	canvas!: HTMLCanvasElement
	scene!: THREE.Scene

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


    updateHighlight() {
      // trigger update of highlighted objects in scene
      this.graph
        .nodeColor(this.graph.nodeColor())
    }
		
	// Constructor.
	constructor(private dataService: DataService) {
	}

	// test(event: any){
	// 	var rightclick; 
	// 	if (event.which) rightclick = (event.which == 3); 
	// 	else if (event.button) rightclick = (event.button == 2); 
	// 	console.log('Rightclick: ' + rightclick); // true or false
	// 	console.log(event.clientX);
	// 	console.log(event.clientY);
	//    }

	

	// @HostListener('document:mousedown', ['$event'])
	// onMouseDown(event: any) {
	// 	console.log('Mouse down!')
	// }

	// @HostListener('document:mouseup', ['$event'])
	// onMouseUp(event: any) {
	// 	console.log('Mouse up!')
	// }

	// @HostListener('keydown.shift', ['$event'])
    // onShiftKeyDown(event: any) {
    //     // optionally use preventDefault() if your combination
    //     // triggers other events (moving focus in case of Shift+Tab)
    //     // e.preventDefault();
    //     console.log('Shift down');
    // }

	// @HostListener('keyup.shift', ['$event'])
    // onShiftKeyUp(event: any) {
    //     // optionally use preventDefault() if your combination
    //     // triggers other events (moving focus in case of Shift+Tab)
    //     // e.preventDefault();
    //     console.log('Shift down');
    // }

	worldPointFromScreenPoint( screenPoint: any, camera: any ) {

		let worldPoint = new THREE.Vector3();
		worldPoint.x = screenPoint.x;
		worldPoint.y = screenPoint.y;
		worldPoint.z = 0;
		worldPoint.unproject( camera );
		return worldPoint;
	
	}

	getCanvasRelativePosition(event: any) {
		const rect = this.canvas.getBoundingClientRect();
		return {
		  x: (event.clientX - rect.left) * this.canvas.width  / rect.width,
		  y: (event.clientY - rect.top ) * this.canvas.height / rect.height,
		};
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

	changeNodeColor(node : Node): void {

		this.highlightNodes.has(node) ? node === this.hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)'
	}

	loadGraph(): void {

		this.data = this.dataCollapsableGraph(this.rawData)
		console.log("DATA: ", this.data)
		
		//Get the tree that is visiable
		const prunedTree = this.getPrunedTree(this.data)
		console.log("PRUNED: ", JSON.stringify(prunedTree))

		
		const NODE_REL_SIZE = 1;
		this.graph = ForceGraph3D()
		(document.getElementById('graph')!)
			.dagMode('td')
			.dagLevelDistance(40)
		// .backgroundColor('#101020')
		// .linkColor(() => 'rgba(255,255,255,0.2)')
		// .nodeRelSize(NODE_REL_SIZE)
		// .nodeId('path')
		// .nodeVal('size')
		// .nodeLabel('path')
		// .nodeAutoColorBy('module')
		// .nodeOpacity(0.9)
		// .linkDirectionalParticles(2)
		// .linkDirectionalParticleWidth(0.8)
		// .linkDirectionalParticleSpeed(0.006)
		// .d3VelocityDecay(0.3)
		.nodeThreeObject(node2 => {

			const node: Node = node2 as Node
			const text = new Text();
			Object.assign(text, {
			text: node.name,
			fontSize: 2,
			});
			return text

		  })
		.nodeThreeObjectExtend(false)
		.onNodeClick((node: Object, event: MouseEvent) => {
			const node2: Node = node as Node
			if(node2.childLinks.length) {
				node2.collapsed = !node2.collapsed;
				const prunedData = this.getPrunedTree(this.data)
				this.graph.graphData(prunedData)
			}

			if (this.highlightNodes.has(node2)) {

				node2.childLinks.forEach((node3)=>{

					if(!this.highlightNodes.has(node3)) {
						this.highlightNodes.add(node3)
					}
					
				})

			}
			else {

				node2.childLinks.forEach((node3)=>{

					if(this.highlightNodes.has(node3)) {
						this.highlightNodes.delete(node3)
					}
					
				})

			}

		})
		.nodeColor(node => this.highlightNodes.has(node) ? node === this.hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)')
		.onNodeHover(node2 => {

			const node: Node = node2 as Node

		// no state change
		if ((!node && !this.highlightNodes.size) || (node && this.hoverNode === node)) return;

		
		if (node) {
			if (this.highlightNodes.has(node)) {
				this.highlightNodes.delete(node)
				node.childLinks.forEach((node3)=>{

					if(this.highlightNodes.has(node3)) {
						this.highlightNodes.delete(node3)
					}
					
				})
			}
			else {
				this.highlightNodes.add(node);
				node.childLinks.forEach((node3)=>{

					if(!this.highlightNodes.has(node3)) {
						this.highlightNodes.add(node3)
					}
					
				})
			}
		}

		this.hoverNode = node || null;

		this.updateHighlight();
		})
		.graphData(prunedTree)


		// This disables clicking on the node but does not disable camera panning
		//this.graph.enablePointerInteraction(false);

		// this.renderer = this.graph.renderer();

		// this.canvas = this.renderer.domElement;

		// this.scene = this.graph.scene();

		// this.camera  = this.graph.camera();

		// const controls = this.graph.controls();

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
