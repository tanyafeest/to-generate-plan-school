import { Student } from "./Student";

export class Sitzplatz
{
    x: number;
    y: number;
    marked: boolean;
    manuallySelected = false;
    name: string;
    neighbours = -1;
    frontRow = false;
    backrow = false;
    constructor(x: number, y: number, marked: boolean) {
        this.x = x;
        this.y = y;
        this.marked = marked;
        this.name = ""
    }
}
