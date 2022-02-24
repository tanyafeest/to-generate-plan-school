import { defineComponent } from "vue";
import { Sitzplatz } from "@/helper/Sitzplatz";
import { Rule } from "./helper/Rule";
import { Student } from "./helper/Student";
import compute from "./helper/Algorithm";
import {Algo} from "./helper/Algo";
import { Algo2 } from "./helper/Algo2";

import { toBlob, toPng, toJpeg } from 'html-to-image';
import  download  from 'downloadjs';
/*  
  + TODO: blaue knöpfe
  + vorlagenknopf
? möglichst nach vorne fixen
  + nicht nach hinten
  + manuell zuweisen

*/

export default defineComponent({
  name: "Sitzplatzplaner",
  props: {},
  data() {
    const maxGridWidth = 15;
    const maxGridHeight = 15;
    return {
      maxGridWidth: maxGridWidth,
      maxGridHeight: maxGridHeight,
      gridWidth: 5,
      gridHeight: 5,
      sideWidth: 25,
      algorithmRandomness: 1,
      studentFieldVisible: true,
      ruleVisible: false,
      algorithmSettingsVisible: false,
      avoidRulesVisible: true,
      nearbyRulesVisible: true,
      firstRowRulesVisible: true,
      notBackRulesVisible: true,
      studentFieldValue: "",
      nearbyRules: [] as Rule[],
      avoidRules: [] as Rule[],
      firstRowRules: [] as string[],
      notBackRules: [] as string[],
      isMouseDown: false,
      presetCount: 3,
      presetPageOpen: false,
      fieldBtnContextMenuOpen: false,
      contextMenuTop: "0px",
      contextMenuLeft: "0px",
      contextMenuOpenedBy: "",
      lastTouch: 0,
      loadingDivOpen: false,
      highlightManuallySelected: true,
      // sitzplaetze2: this.instantiateList(maxGridWidth, maxGridHeight) as Sitzplatz[],
      sitzplaetze: this.instantiateDict(maxGridWidth, maxGridHeight),
    };
  },
  watch: {
    avoidRules: {
      handler() {
        for (let index = 0; index < this.avoidRules.length; index++) {
          if (this.avoidRules[index].student1 == this.avoidRules[index].student2 && this.avoidRules[index].student1 != "") {
            this.avoidRules[index].student2 = "";
          }
        }
      },
      deep: true,
    },
    nearbyRules: {
      handler() {
        for (let index = 0; index < this.nearbyRules.length; index++) {
          if (this.nearbyRules[index].student1 == this.nearbyRules[index].student2 && this.nearbyRules[index].student1 != "") {
            this.nearbyRules[index].student2 = "";
          }
        }
      },
      deep: true,
    },
    studentFieldValue() {
      const names: string[] = this.getNames();
      // check rules
      [this.firstRowRules, this.notBackRules].forEach((rules) =>
      {
        for (let i = rules.length - 1; i >= 0; i--)
        {
          if (!names.includes(rules[i]))
          {
            rules.splice(i, 1);
          }
        }
      });

      [this.avoidRules, this.nearbyRules].forEach((rules) => {
        for (let i = rules.length - 1; i >= 0; i--) {
          if (!(names.includes(rules[i].student1) && names.includes(rules[i].student2))) {
            rules.splice(i, 1);
          }
        }
      });

      // check fields
      for (const key in this.sitzplaetze)
      {
        const field = this.sitzplaetze[key];
        if (!names.includes(field.name))
        {
          field.name = "";
        }
      }
    },
  },
  methods: {
    downloadPlan()
    {
      const node = document.getElementById('sitzplan');
      // if (node)
      // {
      //   toBlob(node)
      //     .then(function (blob)
      //     {
      //       if (blob)
      //       {
      //         saveAs(blob, 'my-node.png');
      //       }
      //     });
      // }

      if (node)
      {
        toPng(node, { pixelRatio: .95 })
        .then(function (dataUrl) {
          download(dataUrl, 'Sitzplan-' + new Date(Date.now()).toLocaleDateString() + ".png");
        });
      }
    },
    onFieldClick(x: number, y: number) {
      const platz: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;

      if (!platz.marked && platz.name != "")
      {
        platz.name = ""
        platz.manuallySelected = false;
      }
    },
    onFieldClickWhenMouseIsDown(x: number, y: number) {
      if (this.isMouseDown) {
        this.onFieldClick(x, y);
      }
    },
    preventctxmenudefault(e: Event)
    {
      e.preventDefault();
    },
    touchstart(x: number, y : number)
    {
      console.log("a")
      this.lastTouch = Date.now();
    },
    touchend(e: Event, x: number, y: number)
    {
      if (Date.now() - this.lastTouch > 200 && !this.fieldBtnContextMenuOpen)
      {
        this.onFieldContextMenu(e,x,y)
      }
      this.lastTouch = Date.now();
    },
    onFieldContextMenu(e : any, x: number, y : number)
    {
      let w = e.x;
      let h = e.y;

      const largestHeight = screen.availHeight - 105;
      const largestWidth = screen.availWidth - 255;
      if (e.y > largestHeight)
      {
        h = largestHeight
      }
      if (e.x > largestWidth)
      {
        w = largestWidth
      }

      this.contextMenuTop = h + "px"
      this.contextMenuLeft = w + "px"

      this.contextMenuOpenedBy = x.toString() + "," + y.toString();
      this.fieldBtnContextMenuOpen = true;
    
      this.$nextTick(() =>
      {
        document.getElementById('fieldSelectionID')?.focus()
      });
    },
    manuallySelectStudent(e : any)
    {
      if (e.trim() != "")
      {
        for (const key in this.sitzplaetze)
        {
          const field = this.sitzplaetze[key];
          if (field.name == e)
          {
            field.name = "";
            field.manuallySelected = false;
          }
        }
        this.sitzplaetze[this.contextMenuOpenedBy].manuallySelected = true;
      }else{this.sitzplaetze[this.contextMenuOpenedBy].manuallySelected = false;}
      this.sitzplaetze[this.contextMenuOpenedBy].name = e;
      this.sitzplaetze[this.contextMenuOpenedBy].marked = true;
    },
    setPreset(i: number) {
      this.presetPageOpen = false;
      this.sitzplaetze = this.instantiateDict(this.maxGridWidth, this.maxGridHeight);
      switch (i) {
        case 0:
          this.gridWidth = 9;
          this.gridHeight = 7;
          for (let y = 0; y < 7; y += 2) {
            for (let x = 0; x < 9; x++) {
              if (x != 4) {
                this.onFieldClick(x, y);
              }
            }
          }
          break;
        case 1:
          this.gridWidth = 7;
          this.gridHeight = 7;
          for (let y = 0; y < 7; y += 2) {
            for (let x = 0; x < 7; x++) {
              if (x != 3) {
                this.onFieldClick(x, y);
              }
            }
          }
          for (let y = 1; y < 6; y += 2) {
            this.onFieldClick(0, y);
            this.onFieldClick(6, y);
          }
          break;
        case 2:
          this.gridWidth = 5;
          this.gridHeight = 5;
          break;
        default:
          break;
      }
    },
    addRule(ruleList: Rule[]) {
      ruleList.push(new Rule());
    },
    deleteRuleAt(i: number, ruleList: Rule[]) {
      ruleList.splice(i, 1);
    },
    deleteUncompleteRules() {
      [this.avoidRules, this.nearbyRules].forEach((ruleList) => {
        for (let i = ruleList.length - 1; i >= 0; i--) {
          if (ruleList[i].student1 == "" || ruleList[i].student2 == "") {
            ruleList.splice(i, 1);
          }
        }
      });
    },
    closeEverythingExcept(except: boolean) {
      this.ruleVisible = false;
      this.studentFieldVisible = false;
      this.algorithmSettingsVisible = false;
      // this.nearbyRulesVisible = false;
      // this.avoidRulesVisible = false;
      return !except;
    },
    addFirstRow(value: string) {
      if (!this.firstRowRules.includes(value)) {
        this.firstRowRules.push(value);
      }
    },
    addNotBackRow(value: string)
    {
      if (!this.notBackRules.includes(value)) {
        this.notBackRules.push(value);
      }
    },
    computePlan() {
      console.log("cmpPLan");
      this.deleteUncompleteRules();
      this.resetNamesOnPlan(true);
      // new Algo(this.getUsedFieldsToComputePlan(), this.createStudentsFromRules()).compute();
      if (!this.checkForImpossibleRules())
      {
        alert("Es überlappen sich Regeln, sodass Schüler sowohl nebeneinander als auch nicht nebeneinander sitzen sollen.")
        return;
      }
      this.loadingDivOpen = true;
      
      // this.$forceUpdate();
      this.$nextTick(() => {
        // compute(this.getUsedFieldsToComputePlan(), this.createStudentsFromRules(), this.algorithmRandomness);
        new Algo2(this.getUsedFieldsToComputePlan(), this.createStudentsFromRules()).compute();
      });
      this.loadingDivOpen = false;
    },
    checkForImpossibleRules()
    {
      for (const rule of this.avoidRules)
      {
        for (const rule2 of this.nearbyRules)
        {
          if ((rule.student1 == rule2.student1 && rule.student2 == rule2.student2) || (rule.student1 == rule2.student2 && rule.student2 == rule2.student1))
          {
            return false;
          }
        }
      }
      return true;
    },
    findStudentInArrayByName(name: string, arr: Student[]) {
      for (const element of arr) {
        if (name == element.name) {
          return element;
        }
      }
    },
    createStudentsFromRules() {
      const studentList = [] as Student[];
      this.getNames().forEach((student) => {
        let firstRow = false;
        this.firstRowRules.forEach((rule) => {
          if (rule == student) {
            firstRow = true;
            return;
          }
        });
        let notBackRow = false;
        this.notBackRules.forEach((rule) => {
          if (rule == student) {
            notBackRow = true;
            return;
          }
        });
        
        // check for double student name
        // studentList.forEach(s => {
        //   while (s.name == student)
        //   {
        //     student += "1";
        //   }
        // });

        const s = new Student(student, [], []);
        s.frontRow = firstRow;
        s.notBackOfTheRoom = notBackRow;

        studentList.push(s);
      });

      this.avoidRules.forEach((rule) => {
        const s1 = this.findStudentInArrayByName(rule.student1, studentList);
        const s2 = this.findStudentInArrayByName(rule.student2, studentList);
        if (s1 && s2) {
          s1.avoid.push(s2);
          s2.avoid.push(s1);
        }
      });

      this.nearbyRules.forEach((rule) => {
        const s1 = this.findStudentInArrayByName(rule.student1, studentList);
        const s2 = this.findStudentInArrayByName(rule.student2, studentList);
        if (s1 && s2) {
          s1.sitWith.push(s2);
          s2.sitWith.push(s1);
        }
      });

      // this.getUsedFieldsToComputePlan().forEach(field => {
      //   if (field.name != "")
      //   {
      //     this.findStudentInArrayByName(field.name, studentList)?.setSeat(field);
      //   }
      // });

      return studentList;
    },
    loadStudentFile(ev: any) {
      const file: File = ev.target.files[0];
      let result;
      const reader = new FileReader();
      if (file.name.includes(".csv")) {
        reader.onload = (res) => {
          result = res?.target?.result;

          if (result) {
            this.loadNamesFromFile(result.toString());
          }
        };
        reader.readAsText(file, 'ISO-8859-1');
      } else {
        alert("Diese Datei ist keine CSV-Datei");
      }
    },
    loadNamesFromFile(data: string) {
      const lines = data.split("\n").filter((x) => x !== null && x !== "");
      let courseName: string;
      this.studentFieldValue = "";
      for (let i = 0; i < lines.length; i++) {
        if (i == 0) {
          courseName = lines[i].split(";").filter((x) => x !== null && x !== "")[0];
        } else if (i > 1) {
          let name: string;
          name = lines[i].split(";")[2].replace(/"/g,"") + " ";
          name += lines[i].split(";")[1].replace(/"/g,"") + "\n";
          if (name.trim().length > 0) {
            this.studentFieldValue += name;
          }
        }
      }
    },
    resetNamesOnPlan(excludeManuallySelected=false) {
      for (let x = 0; x < this.maxGridWidth; x++) {
        for (let y = 0; y < this.maxGridHeight; y++) {
          const field: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
          if (!(excludeManuallySelected && field.manuallySelected)){
            field.name = "";
            field.manuallySelected = false;
          }
        }
      }
    },
    isMarked(x: number, y: number) {
      if (!Object.keys(this.sitzplaetze).includes(x.toString() + "," + y.toString())) {
        return false;
      }
      return this.sitzplaetze[x.toString() + "," + y.toString()].marked;
    },
    isManuallySelected(x: number, y: number) {
      if (!Object.keys(this.sitzplaetze).includes(x.toString() + "," + y.toString())) {
        return false;
      }
      return this.sitzplaetze[x.toString() + "," + y.toString()].manuallySelected;
    },
    // instantiateList(maxGridWidth: number, maxGridHeight: number) {
    //   const fields: Sitzplatz[] = [];
    //   for (let x = 0; x < maxGridWidth; x++) {
    //     for (let y = 0; y < maxGridHeight; y++) {
    //       fields.push(new Sitzplatz(x, y, false));
    //     }
    //   }
    //   return fields;
    // },
    instantiateDict(maxGridWidth: number, maxGridHeight: number) {
      const dict: { [id: string]: Sitzplatz } = {};

      for (let x = 0; x < maxGridWidth; x++) {
        for (let y = 0; y < maxGridHeight; y++) {
          dict[x.toString() + "," + y.toString()] = new Sitzplatz(x, y, false);
        }
      }
      return dict;
    },
    getUsedFieldsToComputePlan() {
      const fields: Sitzplatz[] = [];
      for (let y = 0; y < this.gridHeight; y++) {
        for (let x = 0; x < this.gridWidth; x++) {
          const field: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
          if (field.marked) {
            fields.push(field);
          }
        }
      }
      return fields;
    },
    checkForDoubleNames()
    {
      const names = this.getNames();
      const newNames = [] as string[];
      names.forEach(name => {
        while (newNames.includes(name))
        {
          if (name.includes("_"))
          {
            const temp = name.split("_");
            if (!isNaN(+temp[temp.length - 1])){
              temp[temp.length - 1] = (Number(temp[temp.length - 1]) + 1).toString();
              name = temp.join("_");
            }else
          {
            name += "_1";
          }
          } else
          {
            name += "_1";
          }
        }
        newNames.push(name);
      });

      this.studentFieldValue = newNames.join("\n")
    },
    getNames()
    {
      const names = this.studentFieldValue.split("\n").filter((x) => x !== null && x !== "");
      for (let i = 0; i < names.length; i++) {
        names[i] = names[i].trim();        
      }
      return names;
    },
    getNumberOfFields() {
      return this.getUsedFieldsToComputePlan().length;
    },
    log(a: any) {
      console.log(a);
    },
    alert(a: any)
    {
      this.alert(a);
    }
  },
});
