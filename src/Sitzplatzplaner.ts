import { defineComponent } from "vue";
import { Sitzplatz } from "@/helper/Sitzplatz";

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
      studentFieldValue: "",
      sitzplaetze2: this.instantiateList(
        maxGridWidth,
        maxGridHeight
      ) as Sitzplatz[],
      sitzplaetze: this.instantiateDict(maxGridWidth, maxGridHeight),
    };
  },
  watch: {
    studentFieldValue(){
      console.log(this.studentFieldValue);
    }
  },
  methods: {
    onFieldClick(x: number, y: number) {
      const platz: Sitzplatz =
        this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;
    },
    computePlan() {
      console.log("cmpPLan");
      this.resetNames();
      const a: Sitzplatz[] = this.getUsedFieldsToComputePlan();
      a.forEach((element) => {
        element.name = "b";
      });
      this.getNames();
    },
    resetNames() {
      for (let x = 0; x < this.maxGridWidth; x++) {
        for (let y = 0; y < this.maxGridHeight; y++) {
          const field: Sitzplatz =
            this.sitzplaetze[x.toString() + "," + y.toString()];
          field.name = "";
        }
      }
    },
    isMarked(x: number, y: number) {
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
          const field: Sitzplatz =
            this.sitzplaetze[x.toString() + "," + y.toString()];
          if (field.marked) {
            fields.push(field);
          }
        }
      }
      return fields;
    },
    getNames(){
      console.log(this.studentFieldValue.split("\n").filter(x => x !== null && x!== ""))
    }
  },
});