import { Observable, of } from 'rxjs';

import * as combine from 'mout/array/combine';

export enum PathType {
    distance = 'distance',
    duration = 'duration'
}

/**
 * An O/D pair is described by the origin and destination nodes and the type of path.
 */
export interface OdPair {

    origin: number;
    destination: number;
    pathType: PathType;

}

/**
 * Tag describes the meaning of the particular element to which it is attached.
 */
export interface Tag {

    key: string;
    value: string;

}

/**
 * Relation's member.
 */
export interface Member {

    type: string;
    ref: number;
    role: string;

}

/**
 * Node represents a specific point on the earth's surface defined by its latitude and longitude.
 */
export class Node {

    public nodeId: number;

    public label: number;

    public lat: number;

    public lon: number;

    public tags: Tag[] = [];

    public incomingEdges: Edge[] = [];

    public outgoingEdges: Edge[] = [];

    public drawingOptions: { marker?: google.maps.Marker } = {};

    constructor(nodeId: number) {
        this.nodeId = nodeId;
    }

}

/**
 * Link between two nodes.
 */
export class Edge {

    public edgeId: number;

    public origin: Node;

    public destination: Node;

    public tags: Tag[] = [];

    /**
     * Indicates the distance in meters.
     */
    public distance: number;

    /**
     * Indicates the duration in seconds.
     */
    public duration: number;

    /**
     * Indicates the total duration of the edge, taking into account current traffic conditions.
     */
    public durationInTraffic: number;

    public velocity: number;

    public density: number;

    public flow: number;

    public linkFlow: number;

    public drawingOptions: { polyline?: google.maps.Polyline } = {};

    constructor(edgeId: number) {
        this.edgeId = edgeId;
    }

    /**
     * Calculates the value of the arc flow and assigns it to the linkFlow attribute.
     */
    public calcLinkFlow(): void {

    }

}

/**
 * Relation is a multi-purpose data structure that documents a relationship between two or more data elements.
 */
export class Relation {

    public relationId: number;

    public members: Member[];

    public tags: Tag[] = [];

    constructor(relationId: number) {
        this.relationId = relationId;
    }

}

/**
 * Graph of the transport network.
 */
export class Graph {

    private nodes: Node[] = [];

    private edges: Edge[] = [];

    private relations: Relation[] = [];

    private shortestPaths: Node[][] = [];

    private incidenceMatrix: boolean[][] = [];

    private assignmentMatrix: number[][] = [];

    public getNodes(): Node[] {
        return this.nodes;
    }

    public getEdges(): Edge[] {
        return this.edges;
    }

    public getRelations(): Relation[] {
        return this.relations;
    }

    public getNode(nodeId: number): Node | undefined {
        return this.nodes.find((node: Node) => node.nodeId == nodeId);
    }

    public addOrUpdateNode(node: Node): void {
        const existingNode = this.getNode(node.nodeId);
        if (existingNode) {
            existingNode.lat = node.lat;
            existingNode.lon = node.lon;
            existingNode.tags = combine(existingNode.tags, node.tags);
            existingNode.incomingEdges = combine(existingNode.incomingEdges, node.incomingEdges);
            existingNode.outgoingEdges = combine(existingNode.outgoingEdges, node.outgoingEdges);
        } else {
            this.nodes.push(node);
        }
    }

    public getEdge(edgeId: number): Edge {
        return this.edges.find((edge: Edge) => edge.edgeId == edgeId);
    }

    public addEdge(edge: Edge): void {
        this.edges.push(edge);
    }

    /**
     * https://wiki.openstreetmap.org/wiki/Key:oneway
     * @param edgeId Id of the edge
     */
    public isOneway(edgeId: number): boolean {
        return !!this.getEdge(edgeId).tags.find(tag => tag.key == 'oneway' && tag.value != 'no') ||
            this.isRoundabout(edgeId);
    }

    /**
     * https://wiki.openstreetmap.org/wiki/Tag:junction%3Droundabout
     * @param edgeId Id of the edge
     */
    public isRoundabout(edgeId: number): boolean {
        return this.getEdge(edgeId).tags.find(tag => tag.key == 'junction' && tag.value == 'roundabout') ||
            this.getEdge(edgeId).tags.find(tag => tag.key == 'junction' && tag.value == 'circular') ?
            true : false;
    }

    /**
     * Removes the edges with null distance.
     */
    public removeInvalidatedEdges(): void {
        try {
            const removedEdges: number[] = [];
            if (this.edges.length > 0) {
                for (let i = this.edges.length - 1; i >= 0; i--) {
                    if (this.edges[i].distance == null) {
                        removedEdges.push(this.edges[i].edgeId);
                        this.edges.splice(i, 1);
                    }
                }
                for (const edgeId of removedEdges) {
                    for (const node of this.nodes) {
                        if (node.incomingEdges.length > 0) {
                            for (let i = node.incomingEdges.length - 1; i >= 0; i--) {
                                if (node.incomingEdges[i].edgeId == edgeId) {
                                    node.incomingEdges.splice(i, 1);
                                }
                            }
                        }
                        if (node.outgoingEdges.length > 0) {
                            for (let i = node.outgoingEdges.length - 1; i >= 0; i--) {
                                if (node.outgoingEdges[i].edgeId == edgeId) {
                                    node.outgoingEdges.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Removes the nodes with no outgoing edges and incoming edges.
     */
    public removeDeadNodes(): void {
        try {
            if (this.nodes.length > 0) {
                for (let i = this.nodes.length - 1; i >= 0; i--) {
                    if (this.nodes[i].incomingEdges.length == 0 && this.nodes[i].outgoingEdges.length == 0) {
                        this.nodes.splice(i, 1);
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    public getOdNode(label: number): Node {
        return this.nodes.find((node: Node) => node.label == label);
    }

    public getOdNodes(): Node[] {
        return this.nodes.filter((node: Node) => node.label);
    }

    /**
     * Calculates the set of minimum paths.
     * @param odPairs The O/D pairs
     */
    public calcShortestPaths(odPairs: OdPair[]): Observable<any> {
        return of(null);
    }

    public getShortestPaths(): Node[][] {
        return this.shortestPaths;
    }

    /**
     * Calculates the incidence matrix of paths for O/D pairs.
     */
    public calcIncidenceMatrix(): Observable<any> {
        return of(null);
    }

    public getIncidenceMatrix(): boolean[][] {
        return this.incidenceMatrix;
    }

    /**
     * Calculates the assignment matrix.
     */
    public calcAssignmentMatrix(): Observable<any> {
        return of(null);
    }

    public getAssignmentMatrix(): number[][] {
        return this.assignmentMatrix;
    }

    /**
     * Calculates the set of minimum paths between a source and destination node based on the link distance or duration attribute.
     * k Shortest Paths algorithm in the Eppstein version.
     * @param origin Source node
     * @param destination Destination node
     * @param pathType Distance or duration
     */
    private getShortestPath(origin: number, destination: number, pathType: String): Node[] {
        return null;
    }

}
