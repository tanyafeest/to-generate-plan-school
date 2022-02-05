import { defineComponent } from "vue";
import { Sitzplatz } from "@/helper/Sitzplatz";
import { Rule } from "./helper/Rule";
import { Student } from "./helper/Student";

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
      studentFieldVisible: true,
      ruleVisible: false,
      avoidRulesVisible: true,
      nearbyRulesVisible: false,
      firstRowRulesVisible: false,
      studentFieldValue: "",
      nearbyRules: [] as Rule[],
      avoidRules: [] as Rule[],
      firstRowRules: [] as string[],
      sitzplaetze2: this.instantiateList(maxGridWidth, maxGridHeight) as Sitzplatz[],
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
      for (let i = this.firstRowRules.length - 1; i >= 0; i--) {
        if (!names.includes(this.firstRowRules[i])) {
          this.firstRowRules.splice(i, 1);
        }
      }

      [this.avoidRules, this.nearbyRules].forEach((rules) => {
        for (let i = rules.length - 1; i >= 0; i--) {
          if (!(names.includes(rules[i].student1) && names.includes(rules[i].student2))) {
            rules.splice(i, 1);
          }
        }
      });
    },
  },
  methods: {
    onFieldClick(x: number, y: number) {
      const platz: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;
    },
    addRule(ruleList: Rule[]) {
      ruleList.push(new Rule());
    },
    deleteRuleAt(i: number, ruleList: Rule[]) {
      ruleList.splice(i, 1);
    },
    deleteUncompleteavoidRules() {
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
      // this.nearbyRulesVisible = false;
      // this.avoidRulesVisible = false;
      return !except;
    },
    addFirstRow(value: string) {
      if (!this.firstRowRules.includes(value)) {
        this.firstRowRules.push(value);
      }
    },
    computePlan() {
      console.log("cmpPLan");
      console.log(this.avoidRules);
      this.deleteUncompleteavoidRules();
      this.resetNamesOnPlan();
    },
    resetNamesOnPlan() {
      for (let x = 0; x < this.maxGridWidth; x++) {
        for (let y = 0; y < this.maxGridHeight; y++) {
          const field: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
          field.name = "";
        }
      }
    },
    isMarked(x: number, y: number) {
      if (!Object.keys(this.sitzplaetze).includes(x.toString() + "," + y.toString())) {
        return false;
      }
      return this.sitzplaetze[x.toString() + "," + y.toString()].marked;
    },
    instantiateList(maxGridWidth: number, maxGridHeight: number) {
      const fields: Sitzplatz[] = [];
      for (let x = 0; x < maxGridWidth; x++) {
        for (let y = 0; y < maxGridHeight; y++) {
          fields.push(new Sitzplatz(x, y, false));
        }
      }
      return fields;
    },
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
      for (let x = 0; x < this.gridWidth; x++) {
        for (let y = 0; y < this.gridHeight; y++) {
          const field: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
          if (field.marked) {
            fields.push(field);
          }
        }
      }
      return fields;
    },
    getNames() {
      return this.studentFieldValue.split("\n").filter((x) => x !== null && x !== "");
    },
    getNumberOfFields()
    {
      return this.getUsedFieldsToComputePlan().length;
    },
  },
});
