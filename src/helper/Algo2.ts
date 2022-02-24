import { Sitzplatz } from "./Sitzplatz";
import { Student } from "./Student";
import { StudentRule } from "./StudentRule";
import { Rule } from "./Rule";
export class Algo2 {
    // TODO: ~ L 37: benötigte Reihenanzahl anhand des y-wertes bestimmen
    firstRow: number;
    lastRow: number;
    seats: Sitzplatz[];
    seatsDict: { [id: string]: Sitzplatz } = {};
    studentsDict: { [id: string]: Student } = {};
    students: Student[];
    numberOfFrontSeatsNeeded = 0;
    // frontRowStudents = [] as Student[];
    // notBackRowStudents = [] as Student[];
    // sitWithRules = [] as StudentRule[];
    // avoidRules = [] as StudentRule[];

    // constructor(seats: Sitzplatz[], students: Student[], avoidRules: Rule[], sitWithRules: Rule[], frontRow: string[], notBackRow: string[]) {
    constructor(seats: Sitzplatz[], students: Student[]) {
        this.firstRow = this.getFirstRow(seats);
        this.lastRow = this.getLastRow(seats);
        this.students = students;
        this.seats = seats;
        // create seats dictionary
        seats.forEach((s) => {
            this.seatsDict[s.x.toString() + "," + s.y.toString()] = s;
        });
        // create students dict
        students.forEach((s) => {
            this.studentsDict[s.name] = s;
        });

        // number of front seats needed
        students.forEach((s) => {
            if (s.frontRow) this.numberOfFrontSeatsNeeded++;
        });

        // set manually selected students
        seats.forEach((field) => {
            if (field.name != "") {
                students.forEach((s) => {
                    if (s.name == field.name) {
                        s.setSeat(field);
                    }
                });
            }
        });
        // // set sitWith rules
        // sitWithRules.forEach((element) => {
        //     const s1 = this.findStudentByName(element.student1);
        //     const s2 = this.findStudentByName(element.student2);
        //     if (s1 && s2) {
        //         this.sitWithRules.push(new StudentRule(s1, s2));
        //     }
        // });
        // // set avoid rules
        // avoidRules.forEach((element) => {
        //     const s1 = this.findStudentByName(element.student1);
        //     const s2 = this.findStudentByName(element.student2);
        //     if (s1 && s2) {
        //         this.avoidRules.push(new StudentRule(s1, s2));
        //     }
        // });
        // // set front row rules
        // frontRow.forEach((element) => {
        //     const s = this.findStudentByName(element);
        //     if (s) this.frontRowStudents.push(s);
        // });
        // // set notBackRow rules
        // notBackRow.forEach((element) => {
        //     const s = this.findStudentByName(element);
        //     if (s) this.notBackRowStudents.push(s);
        // });
    }

    //#region debug functions

    printRoom() {
        const empty = "-------|";
        const empty2 = "       |";
        for (let y = 0; y <= this.lastRow; y++) {
            let s = "";
            for (let x = 0; x < 9; x++) {
                const seat = this.findSeatByCoordinates(x, y);
                if (seat) {
                    if (seat.name == "") {
                        s += empty;
                    } else {
                        s += seat.name.slice(0, 7).padEnd(7, " ") + "|";
                    }
                } else s += empty2;
            }
            console.log(s);
        }
        console.log("------------ok-----------");
    }

    //#endregion debug functions

    //#region helper functions

    findStudentByName(name: string) {
        return this.studentsDict[name];
    }
    findSeatByCoordinates(x: number, y: number) {
        // for (const seat of this.seats) {
        //     if (seat.x == x && seat.y == y) return seat;
        // }
        return this.seatsDict[x.toString() + "," + y.toString()];
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

    getRoomNeighbours(x: number, y: number) {
        const result = [] as Sitzplatz[];
        for (let y1 = -1; y1 <= 1; y1++) {
            for (let x1 = -1; x1 <= 1; x1++) {
                if (!(x1 == 0 && y1 == 0)) {
                    const seat = this.findSeatByCoordinates(x1 + x, y1 + y);
                    if (seat) result.push(seat);
                }
            }
        }
        return result;
    }

    getFreeSeatNeighbourCount(x: number, y: number) {
        let freeNeighbourSeats = 0;
        this.getRoomNeighbours(x, y).forEach((n) => {
            if (n.name == "") freeNeighbourSeats++;
        });
        return freeNeighbourSeats;
    }

    shuffleArray(array: any[]) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    //#endregion helper functions

    compute()
    {
        if (this.seats.length == 0) {
            alert("Es sind keine Sitzplätze ausgewählt.");
            return;
        }
        if (this.seats.length < this.students.length) {
            alert("Es gibt weniger Plätze als Schüler");
            return;
        }
        
        // const studentOrder = [] as Student[];
        // this.students.forEach(s => {
        //     if (s.frontRow) studentOrder.push(s);
        // });
        // this.students.forEach(s =>
        // {
        //     if (!studentOrder.includes(s)) studentOrder.push(s);
        // });

        // const studentOrder = this.students.slice();
        // studentOrder.sort((a, b) =>
        // {
        //     if (a.frontRow && b.frontRow) return 0;
        //     else if (a.frontRow) return -1;
        //     else if (b.frontRow) return 1;
        //     if(b.sitWith.length - a.sitWith.length == 0) return (Math.floor(Math.random() * 10) % 2 == 0) ? -1 : 1;
        //     return b.sitWith.length - a.sitWith.length;
        // });
        let freeStudents = this.students.slice();
        const frontRowStudents = [] as Student[];
        const notLastRowStudents = [] as Student[];
        const hasFixedNeighbours = [] as Student[];
        // remove manually seated students
        for (let i = freeStudents.length - 1; i >= 0; i--) {
            if (freeStudents[i].seated) {
                freeStudents.splice(i, 1);
            }
        }
        // add front row students to their own list
        for (let i = freeStudents.length - 1; i >= 0; i--) {
            if (freeStudents[i].frontRow) {
                frontRowStudents.push(freeStudents[i]);
                freeStudents.splice(i, 1);
            }
        }
        // add students that should not sit in the back to their own list
        for (let i = freeStudents.length - 1; i >= 0; i--) {
            if (freeStudents[i].notBackOfTheRoom) {
                notLastRowStudents.push(freeStudents[i]);
                freeStudents.splice(i, 1);
            }
        }
        // this.shuffleArray(firstRow);
        for (let i = freeStudents.length - 1; i >= 0; i--) {
            if (freeStudents[i].sitWith.length > 0) {
                hasFixedNeighbours.push(freeStudents[i]);
                freeStudents.splice(i, 1);
            }
        }
        hasFixedNeighbours.sort((a, b) => b.sitWith.length - a.sitWith.length);
        this.shuffleArray(freeStudents);
        this.shuffleArray(notLastRowStudents);
        // put students that must not sit in the last row at the beginning of the freeStudenst array
        freeStudents = notLastRowStudents.concat(freeStudents);


        // merge all arrays
        const studentOrder = frontRowStudents.concat(hasFixedNeighbours.concat(freeStudents));

        // shuffle students sitting in the first row
        if (frontRowStudents.length > 0)
        {
            let frontRowCount = 0;
            this.seats.forEach((s) =>
            {
                if (s.y == this.firstRow && s.name == "")
                {
                    frontRowCount++;
                }
            });
            const frontRow = this.seats.splice(0, frontRowCount);
            this.shuffleArray(frontRow)
            this.seats = frontRow.concat(this.seats);
            // const frontRow = studentOrder.splice(0, frontRowCount);
            // this.shuffleArray(frontRow);
            // studentOrder = frontRow.concat(studentOrder);
        }



        const freeSeats = [] as Sitzplatz[];
        this.seats.forEach((seat) => {
            if (seat.name == "") freeSeats.push(seat);
        });
        console.clear();
        console.log("Joshua, das ist Florians Algorithmus")
        console.log("Geh in Sitzplatzplaner.ts Z.274")
        const result = this.recSolve(studentOrder, freeSeats); //slice to copy
        if (!result) alert("Dieser Plan ist mit den gegebenen Präferenzen nicht möglich.");
    }

    recSolve(students: Student[], freeSeats: Sitzplatz[], lastStudent?: Student, debug = false) {
        if (students.length == 0) {
            return this.validateFinal(this.students);
        }

        if (lastStudent) {
            if (!this.validateSingleStudent(lastStudent)) {
                return false;
            }
            // check validation for adjacent seats
            for (const seat of this.getRoomNeighbours(lastStudent.getSeat().x, lastStudent.getSeat().y)) {
                if (seat.name != "") {
                    if (!this.validateSingleStudent(this.findStudentByName(seat.name))) return false;
                }
            }
        } else {
            if (!this.validateIncomplete(this.students)) return false;
        }

        if (debug) this.printRoom();

        for (const s of students) {
            if (s.seated) {
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
                    if (this.recSolve(students.slice(), freeSeats.slice(), s)) {
                        return true;
                    }
                    s.unSeat();
                    freeSeats.splice(i, 0, seat);

                    students.splice(index, 0, s);
                }
            }
            console.log("nani1 " + s.name);
            return false;
        }
        if (students.length == 0) {
            return this.validateFinal(this.students);
        }
        console.log("nani3 " + students.length);
        return false;
    }

    //#region validation functions

    validateSingleStudent(s: Student, final = false) {
        if (s.frontRow) {
            if (s.getSeat().y != this.firstRow) {
                console.log("uwu???1");
                return false;
            }
        }
        if (s.notBackOfTheRoom) {
            if (s.getSeat().y == this.lastRow) {
                console.log("uwu???2");
                return false;
            }
        }

        // let allSitWithNeedToBeSeated = true;
        // if (!final) {
        //     for (const n of this.getRoomNeighbours(s.getSeat().x, s.getSeat().y)) {
        //         if (n.name == "") {
        //             allSitWithNeedToBeSeated = false;
        //             break;
        //         }
        //     }
        // }

        // for (const sNearby of s.sitWith) {
        //     if (sNearby.seated || allSitWithNeedToBeSeated) {
        //         if (!this.isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) {
        //             return false;
        //         }
        //     }
        // }
        let freeNeighbourSeatsNeeded = s.sitWith.length;
        for (const sNearby of s.sitWith) {
            if (sNearby.seated) {
                freeNeighbourSeatsNeeded--;
                if (!this.isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                    console.log("uwu???3");
                    return false;
                }
            }
        }

        const freeNeighbourSeats = this.getFreeSeatNeighbourCount(s.getSeat().x, s.getSeat().y);

        if (freeNeighbourSeats < freeNeighbourSeatsNeeded) return false;

        for (const sAvoid of s.avoid) {
            if (sAvoid.seated) {
                if (this.isClose(sAvoid.getSeat().x, sAvoid.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                    console.log("uwu???4");
                    return false;
                }
            }
        }

        return true;
    }
    validateIncomplete(students: Student[]) {
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
                if (n.name == "") {
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
    validateFinal(students: Student[]) {
        for (const s of students) {
            if (!s.seated) {
                // console.log(s.name);
                console.log("uwu5");
                return false;
            }

            for (const sNearby of s.sitWith) {
                if (!this.isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) {
                    // console.log(s.name + "," + sNearby.name);
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
    //#endregion validation functions
}
