export class Sitzplatz
{
    x: number;
    y: number;
    marked: boolean;
    name: string;
    neighbours = -1;
    constructor(x: number, y: number, marked: boolean) {
        this.x = x;
        this.y = y;
        this.marked = marked;
        this.name = ""
    }
}
