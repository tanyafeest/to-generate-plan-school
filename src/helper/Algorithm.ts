
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

    let frontSeatStudents: Student[] = [];
    students.forEach(i => {
        if (i.frontRow) {
            frontSeatStudents.push(i);
        }
    });

    let frontSeats: Sitzplatz[] = [];
    calculateNeighbours(sitzplaetze, frontSeats);


}

function calculateNeighbours(sitzplaetze: Sitzplatz[], frontRow?: Sitzplatz[], lastRow?: Sitzplatz[], middleRows?: Sitzplatz[]) { // calculates the number of neighbours for every seat and sorts the given array, also calculates front Seats.
    let maxX: number = 0;
    let minY: number = 100000;
    let maxY: number = 0;
    sitzplaetze.forEach(i => {
        if (i.x > maxX) {
            maxX = i.x;
        }
        if (i.y > maxY) {
            maxY = i.y
        }
        if (i.y < minY) {
            minY = i.y;
        }
    })

    if (frontRow != undefined) {
        sitzplaetze.forEach(i => {
            if (i.y == minY) {
                frontRow.push(i);
            }
        });
    }
    

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
    })

    sitzplaetze.forEach(i => {
        i.neighbours = sitzplaetzeR[i.x][i.y];
    })

    quickSortNeighbours(sitzplaetze);
}

function quickSortNeighbours(sitzplaetze: Sitzplatz[]) {
    if (sitzplaetze.length > 1){
        let compare: any;
        compare = sitzplaetze.pop();
        let less: Sitzplatz[] = [];
        let more: Sitzplatz[] = [];
        sitzplaetze.forEach(i => {
            if (i.neighbours <= compare.neighbours){
                less.push(i);
            }
            else {
                more.push(i);
            }
        });
        quickSortNeighbours(less);
        quickSortNeighbours(more);
        less.push(compare)
        sitzplaetze = less.concat(more);
    }
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
