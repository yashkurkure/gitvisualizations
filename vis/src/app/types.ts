export interface  LinkRaw {source: number, target: number}
export interface  Link {source: number, target: number}

export interface  NodeRaw { id: number, name: string, leaf: number}
export interface  Node { id: number, name: string, leaf: number, collapsed: boolean, childLinks: Link[]}

export interface GraphDataRaw {
	links : LinkRaw[]
	nodes: NodeRaw[]
}

export interface GraphData {
	links : Link[]
	nodes: Node[]

}