import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import Graph from "../../Wolfie2D/DataTypes/Graphs/Graph";
import EdgeNode from "../../Wolfie2D/DataTypes/Graphs/EdgeNode";



// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    //  it works but for some reason A* Test Scene just breaks? the normal play works fine im pretty sure.
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        let start = this.mesh.graph.snap(from);
        let end = this.mesh.graph.snap(to);

        let parent = this.aStar(this.mesh.graph, start, end, (a, b) => this.heuristic(this.mesh.graph.positions[a], this.mesh.graph.positions[b]));

        let pathStack = new Stack<Vec2>();
        let currentNode = end;

        while (currentNode !== -1) {
            pathStack.push(this.mesh.graph.positions[currentNode]);
            currentNode = parent[currentNode];
        }

        return new NavigationPath(pathStack);
    }

    public heuristic(a, b){
        return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
    }

    private aStar(g: Graph, start: number, end: number, heuristic: (a: number, b: number) => number): Array<number> {
        let openSet: Array<number> = []; 
        let inTree: Array<boolean> = new Array(g.numVertices);
        let distance: Array<number> = new Array(g.numVertices);
        let parent: Array<number> = new Array(g.numVertices);
        let totalCost: Array<number> = new Array(g.numVertices);
        let v: number;
        let w: number;
        let weight: number;
    
        for (let i = 0; i < g.numVertices; i++) {
            inTree[i] = false;
            distance[i] = Infinity;
            totalCost[i] = Infinity;
            parent[i] = -1;
        }
    
        distance[start] = 0;
        totalCost[start] = heuristic(start, end);
        openSet.push(start);
    
        while (openSet.length > 0) {
            openSet.sort((a, b) => totalCost[a] - totalCost[b]);
            v = openSet.shift(); 
            if (v === end) break;
            inTree[v] = true;
            let p = g.edges[v];
            while (p != null) {
                w = p.y;
                weight = p.weight;
    
                if (!inTree[w] && distance[w] > distance[v] + weight) {
                    distance[w] = distance[v] + weight;
                    totalCost[w] = distance[w] + heuristic(w, end);
                    parent[w] = v;
    
                    if (!openSet.includes(w)) {
                        openSet.push(w); 
                    }
                }
                p = p.next;
            }
        }
        return parent;
    }
    
    
    
}