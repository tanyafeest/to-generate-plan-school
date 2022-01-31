<template>
  <div class="sideDiv">
    <!-- <img alt="Vue logo" src="@/assets/GMO_Schullogo.png" style="width:33%; margin-top:3%"> -->
    <!-- <div class="sliderDiv"> -->
    <!-- <input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /><br /> -->
    <p style="margin-top: 5%">{{ gridWidth }} * {{ gridHeight }}</p>
    <!-- <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" /> -->
    <!-- </div> -->
    <div class="studentFieldWrap">
      <button class="btn" @click="studentFieldVisible = !studentFieldVisible">
        Namen der Schüler&nbsp;&nbsp;
        <i v-if="!studentFieldVisible" class="arrowdown" style="float: right" />
        <i v-if="studentFieldVisible" class="arrowup" style="float: right" />
      </button>
      <transition name="studentFieldFade">
        <!-- <div v-if="studentFieldVisible" class="studentFieldDiv"> -->
        <textarea v-if="studentFieldVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1&#10;Name 2&#10;..."> </textarea>
        <!-- </div> -->
      </transition>
    </div>

    <button name="compute" @click="computePlan" class="btn submit">Plan erstellen</button>
  </div>

  <div class="tafelDivOuter">
    <div class="tafelDivInner">TAFEL</div>
  </div>
  <div class="sitzplatzdiv">
    <input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /><br />
    <table class="t1">
      <tr v-for="(_, y) in parseInt(gridHeight)" :key="y">
        <td v-for="(_, x) in parseInt(gridWidth)" :key="x" class="t1" :style="{ height: 90 / parseInt(gridHeight) /*row.length*/ + 'vh' }">
          <button :key="sitzplaetze" class="fieldBtn" @click="onFieldClick(x, y)" :style="{ background: isMarked(x, y) ? 'lightblue' : 'white' }" v-text="sitzplaetze[x.toString() + ',' + y.toString()].name"></button>
        </td>
      </tr>
    </table>
  </div>
  <div class="sitzplatzdiv">
    <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" />
  </div>
</template>

<script lang="ts" src="@/Sitzplatzplaner.ts" />

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="@/style.css" />
