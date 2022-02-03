
import { Sitzplatz } from './Sitzplatz';
import { Student } from './Student';

export default function compute(sitzplaetze : Sitzplatz[], students : Student[]){

    

    let haveRule: Student[] = [];
    students.forEach(i => {
        if (i.frontRow) {
            haveRule.push(i);
        }
        else if (i.avoid.length != 0) {
            haveRule.push(i);
        }
        else if (i.sitWith.length != 0) {
            haveRule.push(i);
        }
    });

    let frontSeats: Student[] = [];
    students.forEach(i => {
        if (i.frontRow) {
            frontSeats.push(i);
        }
    });

}

function calculateNeighbours(sitzplaetze : Sitzplatz[]) {
    let maxX: number = 0;
    let maxY: number = 0;
    sitzplaetze.forEach(i => {
        if (i.x > maxX) {
            maxX = i.x;
        }
        if (i.y > maxY) {
            maxY = i.y
        }
    });

    let sitzplaetzeR: number[][] = [];
    for (let i = 0; i <= maxX; i++) {
        let row: number[] = [];
        for (let j = 0; j <= maxY; j++) {
            row.push(-1);
        }
        sitzplaetzeR.push(row);
    }

    sitzplaetze.forEach(i => {
        for (let j = minLimit(i.x - 1, 0); j <= maxLimit(i.x + 1, maxX); j++) {
            for (let k = minLimit(i.y - 1, 0); k <= maxLimit(i.y + 1, maxX); k++) {
                sitzplaetzeR[j][k]++;
            }
        }
    });
}

function minLimit(input: number, limit: number) {
    if (input >= limit) {
        return input;
    }
    else {
        return limit;
    }
}

function maxLimit(input: number, limit: number) {
    if (input <= limit) {
        return input;
    }
    else {
        return limit;
    }
}

function matchLists(l1: Object[], l2: Object[]){
    //takes two lists and returns true if any element of the first is also in the second.
    l1.forEach(i => {
        if (l2.includes(i)) {
            return true;
        }
    })
    return false;
}
