<template>
  <div class="sideDiv">
    <!-- <img alt="Vue logo" src="@/assets/GMO_Schullogo.png" style="width:33%; margin-top:3%"> -->
    <div class="sliderDiv">
      <input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /><br />
      <div class="sliderInformationDiv">
        <!-- <p style="margin-top: 5%"> -->
        <span style="line-height: 109px"> {{ gridWidth }} * {{ gridHeight }} </span>
        <!-- </p> -->
      </div>
      <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" />
    </div>
    <div class="studentFieldWrap">
      <button class="btn" @click="studentFieldVisible = closeEverythingExcept(studentFieldVisible)">
        Namen der Schüler&nbsp;&nbsp;
        <i v-if="!studentFieldVisible" class="arrowdown" style="float: right" />
        <i v-if="studentFieldVisible" class="arrowup" style="float: right" />
      </button>
      <transition name="openTransition">
        <!-- <div v-if="studentFieldVisible" class="studentFieldDiv"> -->
        <textarea v-if="studentFieldVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1&#10;Name 2&#10;..."> </textarea>
        <!-- </div> -->
      </transition>
    </div>

    <div class="ruleWrap">
      <button class="btn" @click="ruleVisible = closeEverythingExcept(ruleVisible)">
        Sitzregeln&nbsp;&nbsp;
        <i v-if="!ruleVisible" class="arrowdown" style="float: right" />
        <i v-if="ruleVisible" class="arrowup" style="float: right" />
      </button>
      <transition name="openTransition">
        <!-- <textarea v-if="ruleVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1&#10;Name 2&#10;..."> </textarea> -->
        <div class="ruleDiv" v-if="ruleVisible">
          <!-- rules start -->
          <div class="singleRuleDiv" v-for="(_, i) in rules.length" :key="i">
            <button class="deleteRule" @click="deleteRuleAt(parseInt(i))">X</button>
            <select v-model="rules[parseInt(i)].student1" class="ruleSelect">
              <option v-for="o in getNames()" :key="o">{{ o }}</option>
            </select>
            <p style="margin: 0; margin-right: 3%; margin-left: 3%; display: inline-block; color: darkred">-</p>
            <select v-model="rules[parseInt(i)].student2" class="ruleSelect">
              <option v-for="o in getNames()" :key="o">{{ o }}</option>
            </select>
          </div>
          <button class="btn ruleBtn" @click="addRule()">Neue Regel</button>
        </div>
      </transition>
    </div>

    <button name="compute" @click="computePlan" class="btn submit">Plan erstellen</button>
  </div>

  <!-- <div class="sitzplatzdiv">
    <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" />
  </div> -->
  <div class="tafelDivOuter">
    <div class="tafelDivInner">
      <p>TAFEL</p>
    </div>
  </div>
  <div class="sitzplatzdiv">
    <!-- <input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /><br /> -->
    <table class="t1">
      <tr v-for="(_, y) in parseInt(gridHeight)" :key="y">
        <td
          v-for="(_, x) in parseInt(gridWidth)"
          :key="x"
          class="t1"
          :style="{
            height: 90 / parseInt(gridHeight) + 'vh',
            border: !isMarked(x, y) ? 'lightgrey 2px solid' : 'none',
          }"
        >
          <button
            :key="sitzplaetze"
            class="fieldBtn"
            @click="onFieldClick(x, y)"
            :style="{
              background: isMarked(x, y) ? 'lightblue' : 'white',
              border: isMarked(x, y) ? 'black 2px solid' : 'none',
              'border-left': isMarked(x, y) ? (isMarked(x - 1, y) ? 'none' : 'black 2px solid') : 'none',
              'border-top': isMarked(x, y) ? (isMarked(x, y - 1) ? 'none' : 'black 2px solid') : 'none',
            }"
            v-text="sitzplaetze[x.toString() + ',' + y.toString()].name"
          ></button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts" src="@/Sitzplatzplaner.ts" />

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="@/style.css" />
