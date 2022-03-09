import { Algo2 } from "@/helper/Algo2";
import { Sitzplatz } from "@/helper/Sitzplatz";
import { Student } from "@/helper/Student";
import { Rule } from "@/helper/Rule";
addEventListener("message", (event) => {
    const avoidRules = createRuleFromStringArray(event.data.message.avoidRules);
    const sitWith = createRuleFromStringArray(event.data.message.sitWith);
    const notBack = event.data.message.notBack;
    const front = event.data.message.front;

    const names = event.data.message.students;
    const students = createStudentsFromRules(names, front, notBack, avoidRules, sitWith);
    let seats = event.data.message.seats;
    const randomness = event.data.message.randomness;
    const result = new Algo2(seats, students, randomness).compute();
    if (result.done) {
        if (result.error) {
            postMessage({ alert: true, message: result.message });
        }
        if (result.seats) {
            seats = result.seats;
        }
    }
  postMessage({ done: true, seats: seats });
});

function createRuleFromStringArray(array) {
    const new_ = [];
    array.forEach((element) => {
        new_.push(new Rule(element[0], element[1]));
    });
    return new_;
}

function createStudentsFromRules(students, firstRowRules, notBackRules, avoidRules, nearbyRules) {
    const studentList = [];
    students.forEach((student) => {
        let firstRow = false;
        firstRowRules.forEach((rule) => {
            if (rule == student) {
                firstRow = true;
                return;
            }
        });
        let notBackRow = false;
        notBackRules.forEach((rule) => {
            if (rule == student) {
                notBackRow = true;
                return;
            }
        });

        const s = new Student(student, [], []);
        s.frontRow = firstRow;
        s.notBackOfTheRoom = notBackRow;

        studentList.push(s);
    });

    avoidRules.forEach((rule) => {
        const s1 = findStudentInArrayByName(rule.student1, studentList);
        const s2 = findStudentInArrayByName(rule.student2, studentList);
        if (s1 && s2) {
            s1.avoid.push(s2);
            s2.avoid.push(s1);
        }
    });

    nearbyRules.forEach((rule) => {
        const s1 = findStudentInArrayByName(rule.student1, studentList);
        const s2 = findStudentInArrayByName(rule.student2, studentList);
        if (s1 && s2) {
            s1.sitWith.push(s2);
            s2.sitWith.push(s1);
        }
    });

    return studentList;
}

function findStudentInArrayByName(name_, arr) {
    for (const element of arr) {
        if (name_ == element.name) {
            return element;
        }
    }
}
