
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeForceGraph from 'three-forcegraph';
import { GraphData } from 'three-forcegraph';
import SpriteText from 'three-spritetext';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

		data!: Object

	    // The color of the sphere.
		color: THREE.ColorRepresentation = 0x000000;

		// The sphere in the scene.
		sphere!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
	
		// The plane in the scene.
		plane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
	
		// Canvas that WebGL draws on.
		canvas!: HTMLElement | null;
	
		// WebGL Renderer.
		renderer!: THREE.WebGLRenderer;
	
		// The scene.
		scene!: THREE.Scene;
	
		// The camera that captures the scene.
		camera!: THREE.PerspectiveCamera;
	
		// Orbit controls allow controlling the camera.
		orbit!: OrbitControls;

		 // Constructor.
		 constructor(private dataService: DataService) {
		}
	
		//On Initialization of the component.
		ngOnInit(): void {

			this.dataService.currentGraphData.subscribe(graphDataObs=>{
				this.data = graphDataObs.subscribe(
					r=>this.data = r
				);
			
			let datatemp = {
				"nodes": [
				  { "id": "1", "name": "Interests", "val": 0 },
				  { "id": "2", "name": "Music", "val": 1 },
				  { "id": "3", "name": "Graphic Design", "val": 1 },
				  { "id": "4", "name": "Coding", "val": 1 },
				  { "id": "5", "name": "Piano", "val": 2 },
				  { "id": "6", "name": "Guitar", "val": 2 },
				  { "id": "7", "name": "Electronic", "val": 2 },
				  { "id": "8", "name": "Procreate", "val": 2 },
				  { "id": "9", "name": "Photoshop", "val": 2 },
				  { "id": "10", "name": "Illustrator", "val": 2 },
				  { "id": "11", "name": "Sketch", "val": 2 },
				  { "id": "12", "name": "React", "val": 2 },
				  { "id": "13", "name": "TypeScript", "val": 2 },
				  { "id": "14", "name": "GraphQL", "val": 2 },
				  { "id": "15", "name": "Firebase", "val": 2 },
				  { "id": "16", "name": "Tailwind CSS", "val": 2 },
				  { "id": "17", "name": "Computer Graphics", "val": 2 },
				  { "id": "18", "name": "Ableton Live", "val": 3 },
				  { "id": "19", "name": "Reason", "val": 3 },
				  { "id": "20", "name": "Phaser", "val": 3 },
				  { "id": "21", "name": "Three.js", "val": 3 }
				],
				"links": [
				  { "source": "1", "target": "2" },
				  { "source": "1", "target": "3" },
				  { "source": "1", "target": "4" },
				  { "source": "2", "target": "5" },
				  { "source": "2", "target": "6" },
				  { "source": "2", "target": "7" },
				  { "source": "3", "target": "8" },
				  { "source": "3", "target": "9" },
				  { "source": "3", "target": "10" },
				  { "source": "3", "target": "11" },
				  { "source": "4", "target": "12" },
				  { "source": "4", "target": "13" },
				  { "source": "4", "target": "14" },
				  { "source": "4", "target": "15" },
				  { "source": "4", "target": "16" },
				  { "source": "4", "target": "17" },
				  { "source": "7", "target": "18" },
				  { "source": "7", "target": "19" },
				  { "source": "17", "target": "20" },
				  { "source": "17", "target": "21" }
				]
			  }
			this.loadGraph(datatemp)

			});

		}

		loadGraph(data: GraphData): void {
			this.canvas = document.getElementById('canvas-box');
			this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas!,});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.scene = new THREE.Scene();
			this.scene.add(new THREE.AmbientLight(0xbbbbbb));
			this.camera = new THREE.PerspectiveCamera(
				50,
				window.innerWidth / window.innerHeight,
				0.1,
				10000
			  );
			this.camera.position.z = Math.cbrt(2) * 180;
	
			const graph = new ThreeForceGraph().graphData(data);
			graph.numDimensions(2);
			graph.nodeThreeObjectExtend(true);
	
			// const map = new Map(data.nodes.map((obj)=>[obj.id, obj.name]))
	
	
			// graph.nodeThreeObject(node=>{
			// 	if (typeof node.id == "string"){
			// 		const sprite = new SpriteText(map.get(node.id))
			// 		sprite.textHeight = 6;
			// 		sprite.position.y = -8
			// 		return sprite
			// 	}
			// 	else {
			// 		const sprite = new SpriteText("N/A")
			// 		sprite.textHeight = 6;
			// 		sprite.position.y = -8
			// 		return sprite
			// 	}
			// });
			this.scene.add(graph);
			this.camera.lookAt(graph.position);
			
			  const animateGeometry = () => {
	
				graph.tickFrame();
				this.renderer.render(this.scene, this.camera);
	
				// Call animateGeometry again on the next frame.
				window.requestAnimationFrame(animateGeometry);
			};
	
			animateGeometry();
		}

}
