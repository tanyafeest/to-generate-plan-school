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
            class="btn"
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
      sitzplaetze2: this.instantiateList(
        maxGridWidth,
        maxGridHeight
      ) as Sitzplatz[],
      sitzplaetze: this.instantiateDict(maxGridWidth, maxGridHeight),
    };
  },
  watch: {},
  methods: {
    onFieldClick(x: number, y: number) {
      let platz: Sitzplatz =
        this.sitzplaetze[x.toString() + "," + y.toString()];
      platz.marked = !platz.marked;
    },
    computePlan() {
      console.log("cmpPLan");
      this.resetNames();
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
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.t1 {
  border: 2px solid black;
  padding: 0;
}
.tafelDivOuter {
  justify-content: center;
  display: flex;
  margin-left: 25vw;
}
.tafelDivInner {
  background-color: green;
  color: white;
  width: 71vw;
}
.sitzplatzdiv {
  justify-content: center;
  display: flex;
  margin-left: 25vw;
}
.sideDiv {
  width: 25vw;
  height: 100vh;
  position: absolute;
  background-color: white;
  border: 2px solid black;
  /* overflow: auto; */
  justify-content: center;
  padding-top: 25px;
}
table {
  align-self: center;
  border-collapse: collapse;
  table-layout: fixed;
  width: 71vw;
}
.btn {
  width: 100%;
  height: 100%;
  border: none;
  vertical-align: top;
}
/* .inpSlider{
  size: 500px;
} */
/* .inpSlider{
  -webkit-appearance: none;
  height: 25px;
  /* background-color: #42b983; 
  
}
.inpSlider::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width:25px;
  height:25px;
  background-color: red;
}
.inpSlider::-moz-range-thumb{
  -webkit-appearance: none;
  appearance: none;
  width:25px;
  height:25px;
  background-color: red;
} */
</style>
