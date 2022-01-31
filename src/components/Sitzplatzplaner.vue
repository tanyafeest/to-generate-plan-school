<template>
  <div class="sideDiv">
    <input
      type="range"
      name="gridWidth"
      v-model="gridWidth"
      min="5"
      :max="maxGridWidth"
      class="inpSlider"
    /><br />
    <input
      type="range"
      name="gridHeight"
      v-model="gridHeight"
      min="5"
      :max="maxGridHeight"
      class="inpSlider"
    /><br />
    {{ gridWidth }} * {{ gridHeight }}
    <br />
    <div class="studentFieldWrap">
    <button class="btn" @click="studentFieldVisible = !studentFieldVisible">
      <i class="arrowdown"></i>
    </button>
    <br />
    <div v-if="studentFieldVisible" class="studentFieldDiv" id="hide">
      <textarea
        class="studentField"
        v-model="studentFieldValue"
        placeholder="Name 1&#10;Name 2&#10;..."
      >
      </textarea
      ><br />
    </div>
    </div>

    <input
      type="submit"
      name="compute"
      @click="computePlan"
      value="Plan berechnen"
    />
  </div>
  <div class="tafelDivOuter"><div class="tafelDivInner">TAFEL</div></div>
  <div class="sitzplatzdiv">
    <table class="t1">
      <tr v-for="(_, y) in parseInt(gridHeight)" :key="y">
        <td
          v-for="(_, x) in parseInt(gridWidth)"
          :key="x"
          class="t1"
          :style="{ height: 90 / parseInt(gridHeight) /*row.length*/ + 'vh' }"
        >
          <button
            :key="sitzplaetze"
            class="fieldBtn"
            @click="onFieldClick(x, y)"
            :style="{ background: isMarked(x, y) ? 'lightblue' : 'white' }"
            v-text="sitzplaetze[x.toString() + ',' + y.toString()].name"
          ></button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Sitzplatz } from "../helper/Sitzplatz";

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
      let platz: Sitzplatz =
        this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;
    },
    computePlan() {
      console.log("cmpPLan");
      this.resetNames();
      let a: Sitzplatz[] = this.getUsedFieldsToComputePlan();
      a.forEach((element) => {
        element.name = "b";
      });
      this.getNames();
    },
    resetNames() {
      for (let x = 0; x < this.maxGridWidth; x++) {
        for (let y = 0; y < this.maxGridHeight; y++) {
          let field: Sitzplatz =
            this.sitzplaetze[x.toString() + "," + y.toString()];
          field.name = "";
        }
      }
    },
    isMarked(x: number, y: number) {
      return this.sitzplaetze[x.toString() + "," + y.toString()].marked;
    },
    instantiateList(maxGridWidth: number, maxGridHeight: number) {
      let fields: Sitzplatz[] = [];
      for (let x = 0; x < maxGridWidth; x++) {
        for (let y = 0; y < maxGridHeight; y++) {
          fields.push(new Sitzplatz(x, y, false));
        }
      }
      return fields;
    },
    instantiateDict(maxGridWidth: number, maxGridHeight: number) {
      var dict: { [id: string]: Sitzplatz } = {};

      for (let x = 0; x < maxGridWidth; x++) {
        for (let y = 0; y < maxGridHeight; y++) {
          dict[x.toString() + "," + y.toString()] = new Sitzplatz(x, y, false);
        }
      }
      return dict;
    },
    getUsedFieldsToComputePlan() {
      let fields: Sitzplatz[] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        for (let y = 0; y < this.gridHeight; y++) {
          let field: Sitzplatz =
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../style.css";
</style>
