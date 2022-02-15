
import { Sitzplatz } from './Sitzplatz';
import { Student } from './Student';



export default function compute(sitzplaetze: Sitzplatz[], students: Student[], randomness = 0) {
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
    
    orderbyNeighbours(sitzplaetze, true, 0);
    
    const unsolvedFrontSeats: Sitzplatz[] = [];
    const unsolvedSeats: Sitzplatz[] = [];
    sitzplaetze.forEach(i => {
        if (!occupied.includes(i)) {
            if (i.frontRow) {
                unsolvedFrontSeats.push(i);
            }
            else {
                unsolvedSeats.push(i);
            }
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
    
    // occupied is empty from here on
    
    orderByAffability(students);

    const unsolvedFrontSeatStudents: Student[] = [];
    const unsolvedStudents: Student[] = []; // does NOT include front seat Students
    students.forEach(i => {
        if (!i.seated) {
            if (i.frontRow) {
                unsolvedFrontSeatStudents.push(i);
            }
            else {
                unsolvedStudents.push(i);
            }
        }
    });


    // kann später weg
    // for (let i = 0; i < students.length; i++) {
    //     sitzplaetze[i].name = students[i].name;
    // }
    // ----





    if (!recSolveTwice(unsolvedFrontSeatStudents, unsolvedFrontSeats, unsolvedStudents, unsolvedSeats)) {
        alert("Keine Anordnung gefunden");
    }
    console.log(validate(students, true));
    return;
}

function recSolveTwice(unsolved: Student[], seats: Sitzplatz[], nextUnsolved: Student[], nextSeats: Sitzplatz[]) {
    console.log("unsolved.length = " + unsolved.length + ", seats.length = " + seats.length)
    if (unsolved.length == 0 && recSolve(nextUnsolved, seats.concat(nextSeats))) {
        console.log("no unsolved Students");
        return true;
    }
    for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        const student = unsolved.shift();
        console.log("seats.length    = " + seats.length + ". Trying to match Student " + student?.name + " to seat at (" + seat.x + "|" + seat.y + ")");
        if (student == undefined) {
            console.log("no unsolved Students, but this was detected in a way that should never happen");
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
    console.log("could not find combination for given combination of " + unsolved.length + " students.");
    return false;
}

function recSolve(unsolved: Student[], seats: Sitzplatz[]) {
    console.log("unsolved.length = " + unsolved.length + ", seats.length = " + seats.length)
    if (unsolved.length == 0) {
        console.log("no unsolved Students");
        return true;
    }
    for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        const student = unsolved.shift();
        console.log("seats.length    = " + seats.length + ". Trying to match Student " + student?.name + " to seat at (" + seat.x + "|" + seat.y + ")");
        if (student == undefined) {
            console.log("no unsolved Students, but this was detected in a way that should never happen");
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
    console.log("could not find combination for given combination of " + unsolved.length + " students.");
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
}

function orderbyNeighbours(sitzplaetze: Sitzplatz[], calculateRows = false, randomness = 0, alwaysCalculateNeighbours = false) {
    /** calculates the number of neighbours for every seat and sorts the given array, also calculates front Seats.
     * @param {number} randomness
     * how random the order will be: 
     * 0 (or other values under 1) will always return the same order,
     * 1 (or higher) will  shuffle seats with the same neighbour count and
     * 2 (or higher) will return seats in a completely random order.
     * @param {boolean} alwaysCalculateNeighbours
     * with a randomness of 2 or higher */ 
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

    if (randomness < 2 || alwaysCalculateNeighbours) {
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

        if (randomness < 2) {
            sitzplaetze.sort((a, b) => a.neighbours - b.neighbours);
            if (randomness >= 1) {
                // TODO: shuffle individual neighbour groups
            }
        }
    }
    else {
        shuffleArray(sitzplaetze);
    }

    console.log(sitzplaetze);
    if (calculateRows) {
        sitzplaetze.forEach(i => {
            if (i.y == minY) {
                i.frontRow = true;
            }
            if (i.y == maxY) {
                i.backrow = true;
            }
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

function matchLists(l1: Object[], l2: Object[]) {
    //takes two lists and returns true if any element of the first is also in the second.
    l1.forEach(i => {
        if (l2.includes(i)) {
            return true;
        }
    })
    return false;
}

function shuffleArray(array: Object[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}