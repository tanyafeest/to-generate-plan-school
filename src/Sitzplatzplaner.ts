import { defineComponent } from "vue";
import { Sitzplatz } from "@/helper/Sitzplatz";
import { Rule } from "./helper/Rule";
import { Student } from "./helper/Student";

export default defineComponent({
  name: "Sitzplatzplaner",
  props: {
    msg: String,
  },
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
      studentFieldValue: "",
      rules: [] as Rule[],
      sitzplaetze2: this.instantiateList(maxGridWidth, maxGridHeight) as Sitzplatz[],
      sitzplaetze: this.instantiateDict(maxGridWidth, maxGridHeight),
    };
  },
  watch: {
    rules: {
      handler() {
        for (let index = 0; index < this.rules.length; index++) {
          if (this.rules[index].student1 == this.rules[index].student2 && this.rules[index].student1 != "") {
            this.rules[index].student2 = "";
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    onFieldClick(x: number, y: number) {
      const platz: Sitzplatz = this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;
    },
    addRule() {
      this.rules.push(new Rule());
      console.log(this.rules.length);
    },
    deleteRuleAt(i: number) {
      // delete this.rules[i];
      this.rules.splice(i, 1);
    },
    deleteUncompleteRules()
    {
      for (let i = this.rules.length - 1; i >= 0; i--) {
        if (this.rules[i].student1 == "" || this.rules[i].student2 == "")
        {
          this.rules.splice(i, 1);
        }
      }
    },
    closeEverythingExcept(except: boolean) {
      this.ruleVisible = false;
      this.studentFieldVisible = false;
      return !except;
    },
    computePlan() {
      console.log("cmpPLan");
      this.deleteUncompleteRules();
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
  },
});
