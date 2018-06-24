import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { map } from "rxjs/operators";

import { NetworkService } from "src/app/network/network.service";

import { response } from "./mock-data/overpass";

describe('NetworkService', () => {
    let service: NetworkService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                NetworkService
            ]
        });
    });

    describe('createGraph', () => {
        it('should create the graph', () => {
            service = TestBed.get(NetworkService);
            service.createGraph(response).subscribe(() => {
                const graph = service.getGraph();

                expect(graph.getEdges().length).toBe(19);
                expect(graph.getNodes().length).toBe(11);
                expect(graph.getRelations().length).toBe(0);
            });
        });
        it('should accept 0 elements', () => {
            service = TestBed.get(NetworkService);
            service.createGraph({ elements: [] }).subscribe(() => {
                const graph = service.getGraph();

                expect(graph.getEdges().length).toBe(0);
                expect(graph.getNodes().length).toBe(0);
                expect(graph.getRelations().length).toBe(0);
            });
        });
    });
});