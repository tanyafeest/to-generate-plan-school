import { Sitzplatz } from "./Sitzplatz";

export class Student
{
    name : string;
    frontRow = false;
    notBackOfTheRoom = false;
    avoid : Student[];
    sitWith: Student[];
    affability = 0;
    private dummySeat: Sitzplatz;
    private seat: Sitzplatz;
    seated = false;
    constructor(name: string, avoid: Student[] = [], sitWith: Student[] = []) {
        this.name = name;
        this.avoid = avoid;
        this.sitWith = sitWith;
        this.dummySeat = new Sitzplatz(-1, -1, false);
        this.seat = this.dummySeat;
    }

    
    public validate(final = true) {
        // TODO: detecting rows 
        if (!this.seat.marked)
        {
            return false;
        }
        for (let j = 0; j < this.avoid.length; j++) {
            const toAvoid = this.avoid[j];
            if (isClose(this.seat.x, this.seat.y, toAvoid.seat.x, toAvoid.seat.y))
            {
                return false;
            }
        }
        for (let j = 0; j < this.sitWith.length; j++) {
            const toSitwith = this.sitWith[j];
            if (!isClose(this.seat.x, this.seat.y, toSitwith.seat.x, toSitwith.seat.y) && final || toSitwith.seated && !isClose(this.seat.x, this.seat.y, toSitwith.seat.x, toSitwith.seat.y))
            {
                return false;
            }
        }
        return true;
    }
    
    public calculateAffability() {
        this.affability = this.sitWith.length*0.5 - this.avoid.length
    }

    public setSeat(seat: Sitzplatz) {
        if (this.seated && this.seat != seat) {
            console.log(this.name + " hat versucht, sich auf einen Stuhl zu setzen (" + seat.x + "|" + seat.y + "), ohne vorher von seinem ursprünglichen (" + this.seat.x + "|" + this.seat.y + ") aufzustehen. Er wird zum Aufstehen gebracht.")
        }
        this.unSeat();
        if (seat.name != "" && seat.name != this.name) {
            console.log(this.name + " hat versucht sich auf einen bereits von " + seat.name + " belegten Stuhl an der Position (" + seat.x + "|" + seat.y + ") zu setzen. Er wurde davon abgehalten, und bleibt ohne Sitzplatz.");
            return;
        }
        this.seat = seat;
        seat.name = this.name;
        this.seated = true;
    }
    
    public unSeat() {
        this.seat.name = "";
        this.seat = this.dummySeat;
        this.seated = false;
    }
    
    public getSeat() {
        return this.seat;
    }
}

function isClose(x1: number, y1: number, x2: number, y2: number)
{
    return (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1)
}