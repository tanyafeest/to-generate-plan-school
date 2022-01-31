export class Student
{
    name : string;
    frontRow : boolean = false;
    avoid : Student[];
    sitWith : Student[];
    constructor(name: string, avoid: Student[] = [], sitWith: Student[] = []) {
        this.name = name;
        this.avoid = avoid;
        this.sitWith = sitWith;
    }
}
