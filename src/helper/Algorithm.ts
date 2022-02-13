
import { Sitzplatz } from './Sitzplatz';
import { Student } from './Student';

export default function compute(sitzplaetze: Sitzplatz[], students: Student[]) {
    if (sitzplaetze.length < students.length) {
        alert("Es gibt weniger Plätze als Schüler")
        return;
    }
    
    console.log(students);
    console.log(students[0].seated)
    
    students.forEach(i => {
        i.unSeat();
    });
    
    
    const occupied: Sitzplatz[] = [];
    sitzplaetze.forEach(i => {
        if (i.name != "") {
            occupied.push(i);
        }
    });

    const unsolvedSeats: Sitzplatz[] = [];
    sitzplaetze.forEach(i => {
        if (!occupied.includes(i)) {
            unsolvedSeats.push(i);
        }
    });

    if (occupied.length > 0) {
        students.forEach(i => {
            for (let j = 0; j < occupied.length; j++) {
                const occupiedSeat = occupied[j];
                if (i.name == occupiedSeat.name) {
                    i.setSeat(occupiedSeat);
                    if (occupiedSeat != occupied.splice(j, 1)[0]) {
                        alert("Irgendetwas ist beim Setzen der Schüler an ihre voreingestellten Sitzplaetze schiefgegeangen.")
                    }
                }
            }
        });
    }

    const unsolvedStudents: Student[] = [];
    students.forEach(i => {
        if (!i.seated) {
            unsolvedStudents.push(i);
        }
    });

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

    if (!recSolve(unsolvedStudents, unsolvedSeats)) {
        alert("Keine Anordnung gefunden");
    }
    console.log(validate(students, true));
    return;
}

function recSolve(unsolved: Student[], seats: Sitzplatz[]) {
    console.log("unsolved.length = " + unsolved.length + ", seats.length = " + seats.length)
    if (unsolved.length == 0) {
        console.log("no unsolved Students");
        return true;
    }
    for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        const student = unsolved.shift()
        console.log("seats.length    = " + seats.length + ". Trying to match Student " + student?.name + " to seat at (" + seat.x + "|" + seat.y + ")");
        if (student == undefined) {
            console.log("no unsolved Students 2")
            return true;
        }
        student.setSeat(seat);
        if (student.validate(false)) {
            const temp = seats.splice(i, 1);
            if (recSolve(unsolved, seats)) {
                console.log("found seat for " + student.name + ": (" + temp[0].x + "|" + temp[0].y + ")");
                return true;
            }
            seats.splice(i, 0, temp[0]);
        }
        student.unSeat();
        unsolved.unshift(student);
    }
    console.log("could not find combination for given combination of " + unsolved.length + " students.")
    return false;
}

function validate(students: Student[], final = true) {
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        if (!student.validate(final)) {
            return false;
        }
    }
    return true;
}

function orderByAffability(students: Student[]) {
    students.forEach(i => {
        i.calculateAffability();
    });
    students.sort((a, b) => a.affability - b.affability);
    console.log(students);
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
        for (let j = Math.max(i.x - 1, 0); j <= Math.min(i.x + 1, maxX); j++) {
            for (let k = Math.max(i.y - 1, 0); k <= Math.min(i.y + 1, maxY); k++) {
                sitzplaetzeR[j][k]++;
            }
        }
    })

    sitzplaetze.forEach(i => {
        i.neighbours = sitzplaetzeR[i.x][i.y];
    })

    sitzplaetze.sort((a, b) => a.neighbours - b.neighbours);

    console.log(sitzplaetze);
    if (rows != undefined) {
        for (let i = 0; i < maxY - minY + 1; i++) {
            rows.push([]);

        }
        sitzplaetze.forEach(i => {
            rows[i.y - minY].push(i);
        });
    }

}

/* function quickSortNeighbours(sitzplaetze: Sitzplatz[]) {
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
} */

/* function quickSortAffability(students: Student[]) {
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
} */

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
