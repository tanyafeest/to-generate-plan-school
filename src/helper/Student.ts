import { Sitzplatz } from "./Sitzplatz";

export class Student
{
    name : string;
    frontRow = false;
    avoid : Student[];
    sitWith: Student[];
    affability = 0;
    seat: Sitzplatz;
    constructor(name: string, avoid: Student[] = [], sitWith: Student[] = []) {
        this.name = name;
        this.avoid = avoid;
        this.sitWith = sitWith;
        this.seat = new Sitzplatz(-1, -1, false);
    }

    /**
     * calculateAffability
     */
    public calculateAffability() {
        this.affability = this.sitWith.length - this.avoid.length
    }
}
