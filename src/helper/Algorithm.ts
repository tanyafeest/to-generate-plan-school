
import { Sitzplatz } from './Sitzplatz';
import { Student } from './Student';

export default function compute(sitzplaetze : Sitzplatz[], students : Student[]){
    let frontSeats : Student[] = [];
    students.forEach(i => {
        if (i.frontRow) {
            frontSeats.push(i);
        }
    });

}

function matchStudents(l1: Student[], l2: Student[]){
    //takes two lists and returns true if any element of the first is also in the second.
    l1.forEach(i => {
        if (l2.includes(i)) {
            return true;
        }
    })
    return false;
}
