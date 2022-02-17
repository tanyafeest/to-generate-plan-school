import { Sitzplatz } from "./Sitzplatz";
import { Student } from "./Student";

export class Algo {
    firstRow: number;
    lastRow: number;
    seats: Sitzplatz[];
    students: Student[];
    constructor(seats: Sitzplatz[], students: Student[]) {
        this.firstRow = this.getFirstRow(seats);
        this.lastRow = this.getLastRow(seats);
        this.students = students;
        this.seats = seats;
    }
    compute() {
        const seats = this.seats;
        const students = this.students;
        // set manual student seats
        seats.forEach((field) => {
            if (field.name != "") {
                students.forEach((s) => {
                    if (s.name == field.name) {
                        s.setSeat(field);
                    }
                });
            }
        });

        // console.log(validate(students, seats));
        // return;
        if (seats.length == 0) {
            alert("Es sind keine Sitzplätze ausgewählt.");
            return;
        }
        if (seats.length < students.length) {
            alert("Es gibt weniger Plätze als Schüler");
            return;
        }
        console.log("recSolve");
        this.recSolve(students.slice(), seats.slice()); //slice to copy
        alert("berechnet uwu");
    }

    recSolve(students: Student[], freeSeats: Sitzplatz[]) {
        this.printRoom();
        if (students.length == 0) {
            // call after last element
            // console.log("yay or nay")
            return this.validateFinal(this.students, this.seats);
        }

        if (!this.validateIncomplete(this.students, this.seats)) {
            // console.log("nay.")
            return false;
        }

        for (const s of students) {
            if (s.seated) {
                // n += 1;
                students.splice(students.indexOf(s), 1);
                continue;
            }
            for (let i = 0; i < freeSeats.length; i++) {
                const seat = freeSeats[i];
                if (seat.name == "") {
                    freeSeats.splice(i, 1);

                    const index = students.indexOf(s);
                    students.splice(index, 1);

                    s.setSeat(seat);
                    if (this.recSolve(students.slice(), freeSeats.slice())) {
                        return true;
                    }
                    s.unSeat();
                    freeSeats.splice(i, 0, seat);

                    students.splice(index, 0, s);
                }
            }
        }
        if (students.length == 0) {
            return this.validateFinal(this.students, this.seats);
        }
        return false;
    }
    printRoom() {
        const empty = "---";
        for (let y = 0; y <= this.lastRow; y++) {
            let s = "";
            for (let x = 0; x < 9; x++) {
                for (const sea of this.seats)
                {
                    if(x == 0 && y == 0) console.log("???")
                    if (sea.x == x && sea.y == y) {
                        if (sea.name == "") {
                            s += empty + "|";
                        } else {
                            s += sea.name + "|";
                        }
                    }
                }
            }
            console.log(s);
        }
        console.log("ok");
    }
    getRoomNeighbours(x: number, y: number)
    {
        const result = [] as Sitzplatz[]
        for (const s of this.seats) {
            if (this.isClose(x, y, s.x, s.y))
            {
                result.push(s);
            }
        }
        return result;
    }
    validateIncomplete(students: Student[], seats: Sitzplatz[]) {
        for (const s of students) {
            if (!s.seated) continue;

            if (s.frontRow) {
                if (s.getSeat().y != this.firstRow) {
                    console.log("uwu1");
                    return false;
                }
            }
            if (s.notBackOfTheRoom) {
                if (s.getSeat().y == this.lastRow) {
                    console.log("uwu2");
                    return false;
                }
            }
            
            let allSitWithNeedToBeSeated = true;
            for (const n of this.getRoomNeighbours(s.getSeat().x, s.getSeat().y)) {
                if (n.name == "")
                {
                    allSitWithNeedToBeSeated = false;
                    break;
                }
            }

            for (const sNearby of s.sitWith) {
                if (sNearby.seated || allSitWithNeedToBeSeated) {
                    if (!this.isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                        console.log("uwu3");
                        return false;
                    }
                }
            }

            for (const sAvoid of s.avoid) {
                if (sAvoid.seated) {
                    if (this.isClose(sAvoid.getSeat().x, sAvoid.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                        console.log("uwu4");
                        return false;
                    }
                }
            }
        }
        return true;
    }
    validateFinal(students: Student[], seats: Sitzplatz[]) {
        for (const s of students) {
            if (!s.seated) {
                console.log(s.name);
                console.log("uwu5");
                return false;
            }

            for (const sNearby of s.sitWith) {
                if (!this.isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                    console.log(s.name + "," + sNearby.name);
                    console.log("uwu6");
                    return false;
                }
            }

            for (const sAvoid of s.avoid) {
                if (this.isClose(sAvoid.getSeat().x, sAvoid.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                    console.log("uwu7");
                    return false;
                }
            }

            if (s.frontRow) {
                if (s.getSeat().y != this.firstRow) {
                    console.log("uwu8");
                    return false;
                }
            }
            if (s.notBackOfTheRoom) {
                if (s.getSeat().y == this.lastRow) {
                    console.log("uwu9");
                    return false;
                }
            }
        }
        return true;
    }

    getLastRow(seats: Sitzplatz[]) {
        let maxRow = 0;
        for (const s of seats) {
            maxRow = Math.max(maxRow, s.y);
        }
        return maxRow;
    }

    getFirstRow(seats: Sitzplatz[]) {
        let minRow = Number.MAX_VALUE;
        for (const s of seats) {
            minRow = Math.min(minRow, s.y);
        }
        return minRow;
    }

    isClose(x1: number, y1: number, x2: number, y2: number) {
        if (x1 == -1 || x2 == -1) return false;
        return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
    }
}
