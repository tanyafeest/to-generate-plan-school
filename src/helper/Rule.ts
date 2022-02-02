import { Student } from './Student';
export class Rule
{
    student1 : string;
    student2 : string;
    constructor(student1 = "", student2 = "") {
        this.student1 = student1;
        this.student2 = student2;
    }
}
