import { Sitzplatz } from "./Sitzplatz";
import { Student } from "./Student";

export default function compute2(seats: Sitzplatz[], students: Student[])
{
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
    console.log("recSolve")
    recSolve(students, seats, seats.slice(), 0); //slice to copy
    alert("berechnet uwu")
}

function recSolve(students: Student[], seats: Sitzplatz[], freeSeats: Sitzplatz[], n: number)
{
    // console.log("call " + n)
    if (n == students.length) // call after last element
    {
        // console.log("yay or nay")
        return validateFinal(students, seats);
    }

    if (!validateIncomplete(students, seats))
    {
        // console.log("nay.")
        return false;
    }

    const arr = [] as Student[];
    for (let i = 0; i < students.length; i++) {
        if (i >= n)
        {
            arr.push(students[i])
        }
    }

    for (const s of arr)
    {
        if (s.seated) { n += 1; continue }
        for (let i = 0; i < freeSeats.length; i++)
        {
            const seat = seats[i];
            if (seat.name == "")
            {
                freeSeats.splice(i, 1)
                s.setSeat(seat);
                if (recSolve(students, seats, freeSeats, n + 1))
                {
                    return true;
                }
                s.unSeat();
                freeSeats.splice(i, 0, seat);
            }
        }
    }
    if (n == students.length)
    {
        return validateFinal(students, seats);
    }
    return false;
}

function validateIncomplete(students: Student[], seats: Sitzplatz[])
{
    for (const s of students)
    {
        if (!s.seated) continue;

        if (s.frontRow)
        {
            if (s.getSeat().y != getFirstRow(seats)) return false;
        }
        if (s.notBackOfTheRoom)
        {
            if (s.getSeat().y == getLastRow(seats)) return false;
        }

        for (const sNearby of s.sitWith)
        {
            if (sNearby.seated)
            {
                if (!isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) return false;
            }
        }

        for (const sAvoid of s.avoid)
        {
            if (sAvoid.seated)
            {
                if (isClose(sAvoid.getSeat().x, sAvoid.getSeat().y, s.getSeat().x, s.getSeat().y)) return false;
            }
        }

    }
    return true;
}
function validateFinal(students: Student[], seats: Sitzplatz[]) {
    for (const s of students) {
        if (!s.seated) return false;

        for (const sNearby of s.sitWith) {
            if (!isClose(sNearby.getSeat().x, sNearby.getSeat().y, s.getSeat().x, s.getSeat().y)) return false;
        }

        for (const sAvoid of s.avoid) {
            if (isClose(sAvoid.getSeat().x, sAvoid.getSeat().y, s.getSeat().x, s.getSeat().y)) return false;
        }

        if (s.frontRow) {
            if (s.getSeat().y != getFirstRow(seats)) return false;
        }
        if (s.notBackOfTheRoom) {
            if (s.getSeat().y == getLastRow(seats)) return false;
        }
    }
    return true;
}

function getLastRow(seats: Sitzplatz[]) {
    let maxRow = 0;
    for (const s of seats) {
        maxRow = Math.max(maxRow, s.y);
    }
    return maxRow;
}

function getFirstRow(seats: Sitzplatz[]) {
    let minRow = Number.MAX_VALUE;
    for (const s of seats) {
        minRow = Math.min(minRow, s.y);
    }
    return minRow;
}

function isClose(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}
