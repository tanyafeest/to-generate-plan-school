
import { Sitzplatz } from './Sitzplatz';
import { Student } from './Student';

export default function compute(sitzplaetze: Sitzplatz[], students: Student[]) {

    if (sitzplaetze.length < students.length) {
        alert("Es gibt weniger Plätze als Schüler")
        return;
    }


    // kann später weg
    // for (let i = 0; i < students.length; i++) {
    //     sitzplaetze[i].name = students[i].name;
    // }
    // ----


    const haveRule: Student[] = [];
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

    const frontSeatStudents: Student[] = [];
    students.forEach(i => {
        if (i.frontRow) {
            frontSeatStudents.push(i);
        }
    });

    const rows: Sitzplatz[][] = [];
    calculateNeighbours(sitzplaetze, rows);

    orderByAffability(students);

    const unsolvedSeats: Sitzplatz[] = [];
    sitzplaetze.forEach(i => {
        unsolvedSeats.push(i);
    });

    const unsolvedStudents: Student[] = [];
    students.forEach(i => {
        unsolvedStudents.push(i);
    });
    recSolve(unsolvedStudents, unsolvedSeats);
    return;
}

function recSolve(unsolved: Student[], seats: Sitzplatz[]) {
    for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        const student = unsolved.shift()
        if (student == undefined) {
            return true;
        }
        student.setSeat(seat);
        if (student.validate(false)) {
            const temp = seats.splice(i, 1);
            if (recSolve(unsolved, seats)) {
                return true;
            }
            seats.splice(i, 0, temp[0]);
        }
        student.unSeat();
    }
    return false;
}

function validate(students: Student[]) {
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        if (!student.validate()) {
            return false;
        }
    }
    return true;
}

function orderByAffability(students: Student[]) {
    students.forEach(i => {
        i.calculateAffability();
    });
    quickSortAffability(students);
}

function calculateNeighbours(sitzplaetze: Sitzplatz[], rows?: Sitzplatz[][]) { // calculates the number of neighbours for every seat and sorts the given array, also calculates front Seats.
    let maxX = 0;
    let minY = 100000;
    let maxY = 0;
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

    const sitzplaetzeR = [] as number[][];
    for (let i = 0; i <= maxX; i++) {
        const row = [] as number[];
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

    if (rows != undefined) {
        for (let i = 0; i < maxY - minY + 1; i++) {
            rows.push([]);

        }
        sitzplaetze.forEach(i => {
            rows[i.y - minY].push(i);
        });
    }

}

function quickSortNeighbours(sitzplaetze: Sitzplatz[]) {
    if (sitzplaetze.length > 1) {
        const compare: any = sitzplaetze.pop();
        const less: Sitzplatz[] = [];
        const more: Sitzplatz[] = [];
        sitzplaetze.forEach(i => {
            if (i.neighbours <= compare.neighbours) {
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

function quickSortAffability(students: Student[]) {
    if (students.length > 1) {
        const compare: any = students.pop();
        const less = [] as Student[]
        const more = [] as Student[]
        students.forEach(i => {
            if (i.affability <= compare.affability) {
                less.push(i);
            }
            else {
                more.push(i);
            }
        });
        quickSortAffability(less);
        quickSortAffability(more);
        less.push(compare)
        students = less.concat(more);
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

function matchLists(l1: [], l2: []) {
    //takes two lists and returns true if any element of the first is also in the second.
    l1.forEach(i => {
        if (l2.includes(i)) {
            return true;
        }
    })
    return false;
}
