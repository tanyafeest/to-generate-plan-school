<template>
  <div class="presetDiv" v-if="presetPageOpen">
    <div class="presetContent">
      <button class="closePresetContent" @click="presetPageOpen = false">X</button>
      <button v-for="(_, i) in parseInt(presetCount)" :key="i" class="presetBtn" @click="setPreset(i)">
        <img :src="require(`@/assets/preset${i}.png`)" class="presetImg" />
      </button>
    </div>
  </div>
  <div @mousedown="isMouseDown = true" @mouseup="isMouseDown = false">
    <div class="sideDiv">
      <!-- <img alt="Vue logo" src="@/assets/GMO_Schullogo.png" style="width:33%; margin-top:3%"> -->
      <div class="sliderDiv">
        <div class="sliderInformationDiv">
          <!-- <p style="margin-top: 5%"> -->
          <span style="line-height: 25px; padding-top: 31px"> {{ gridWidth }} * {{ gridHeight }}<br />{{ getNumberOfFields() }} Sitzplätze</span>
          <!-- </p> -->
        </div>
        <div class="verticalSliderDiv"><input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /></div>
        <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" />
      </div>
      <div>
        <button @click="presetPageOpen = true" class="openPresetBtn">Raumvorlagen öffnen</button>
      </div>
      <!-- <div class="sliderDiv">
    </div> -->
      <div class="studentFieldWrap">
        <button class="btn" @click="studentFieldVisible = closeEverythingExcept(studentFieldVisible)">
          Namen der Schüler&nbsp;&nbsp;
          <i v-if="!studentFieldVisible" class="arrowdown" />
          <i v-if="studentFieldVisible" class="arrowup" />
        </button>
        <transition name="openTransition">
          <div v-if="studentFieldVisible" class="studentFieldDiv">
            <textarea v-if="studentFieldVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1&#10;Name 2&#10;..."> </textarea>
            <input type="file" accept="text/csv,application/csv" id="fileInputThingy" @change="loadStudentFile($event)" />
            <button class="fileInputThingy">
              <label for="fileInputThingy" style="width: 100%; height: 100%; display: block; cursor: pointer"><span style="line-height: 31px"> Datei auswählen </span></label>
            </button>
          </div>
        </transition>
      </div>

      <div class="ruleWrap">
        <button class="btn" @click="ruleVisible = closeEverythingExcept(ruleVisible)">
          Sitzregeln&nbsp;&nbsp;
          <i v-if="!ruleVisible" class="arrowdown" />
          <i v-if="ruleVisible" class="arrowup" />
        </button>
        <transition name="openTransition">
          <!-- <textarea v-if="ruleVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1&#10;Name 2&#10;..."> </textarea> -->
          <div class="ruleDiv" v-if="ruleVisible">
            <!-- avoidRules start -->
            <!-- <button
            class="btn subBtn"
            @click="
              avoidRulesVisible = closeEverythingExcept(avoidRulesVisible);
              ruleVisible = true;
            "
          > -->
            <button class="btn subBtn" @click="avoidRulesVisible = !avoidRulesVisible">
              Dürfen nicht nebeneinander&nbsp;&nbsp;
              <i v-if="!avoidRulesVisible" class="arrowdown" />
              <i v-if="avoidRulesVisible" class="arrowup" />
            </button>
            <transition name="openTransition">
              <div class="ruleTypeDiv" v-if="avoidRulesVisible">
                <div class="singleRuleDiv" v-for="(_, i) in avoidRules.length" :key="i">
                  <button class="deleteRule" @click="deleteRuleAt(parseInt(i), avoidRules)">X</button>
                  <select v-model="avoidRules[parseInt(i)].student1" class="ruleSelect">
                    <option v-for="o in getNames()" :key="o">{{ o }}</option>
                  </select>
                  <p style="margin: 0; margin-right: 3%; margin-left: 3%; display: inline-block; color: darkred">-</p>
                  <select v-model="avoidRules[parseInt(i)].student2" class="ruleSelect">
                    <option v-for="o in getNames()" :key="o">{{ o }}</option>
                  </select>
                </div>
                <button class="btn ruleBtn" @click="addRule(avoidRules)">Neue Regel</button>
              </div>
            </transition>

            <!-- nearbyRules start -->
            <!-- <button
            class="btn subBtn"
            @click="
              nearbyRulesVisible = closeEverythingExcept(nearbyRulesVisible);
              ruleVisible = true;
            "
          > -->
            <button class="btn subBtn" @click="nearbyRulesVisible = !nearbyRulesVisible">
              Sollen möglichst nebeneinander&nbsp;&nbsp;
              <i v-if="!nearbyRulesVisible" class="arrowdown" />
              <i v-if="nearbyRulesVisible" class="arrowup" />
            </button>
            <transition name="openTransition">
              <div class="ruleTypeDiv" v-if="nearbyRulesVisible">
                <div class="singleRuleDiv" v-for="(_, i) in nearbyRules.length" :key="i">
                  <button class="deleteRule" @click="deleteRuleAt(parseInt(i), nearbyRules)">X</button>
                  <select v-model="nearbyRules[parseInt(i)].student1" class="ruleSelect">
                    <option v-for="o in getNames()" :key="o">{{ o }}</option>
                  </select>
                  <p style="margin: 0; margin-right: 3%; margin-left: 3%; display: inline-block; color: darkgreen">-</p>
                  <select v-model="nearbyRules[parseInt(i)].student2" class="ruleSelect">
                    <option v-for="o in getNames()" :key="o">{{ o }}</option>
                  </select>
                </div>
                <button class="btn ruleBtn" @click="addRule(nearbyRules)">Neue Regel</button>
              </div>
            </transition>

            <!-- first row rules start -->
            <!-- <button
            class="btn subBtn"
            @click="
              firstRowRulesVisible = closeEverythingExcept(firstRowRulesVisible);
              ruleVisible = true;
            "
          > -->
            <button class="btn subBtn" @click="firstRowRulesVisible = !firstRowRulesVisible">
              Möglichst nach vorne&nbsp;&nbsp;
              <i v-if="!firstRowRulesVisible" class="arrowdown" />
              <i v-if="firstRowRulesVisible" class="arrowup" />
            </button>
            <transition name="openTransition">
              <div class="ruleTypeDiv" v-if="firstRowRulesVisible">
                <div class="firstRowRulesWrap">
                  <div class="singleRuleDiv firstRowRule" v-for="(_, i) in firstRowRules.length" :key="i">
                    <button class="deleteRule" @click="deleteRuleAt(parseInt(i), firstRowRules)">X</button>
                    {{ firstRowRules[i] }}
                  </div>
                </div>
                <select
                  class="ruleSelect"
                  style="width: 100%; height: 100%; margin-bottom: 2%; padding-bottom: 2%; text-align: center"
                  @change="
                    addFirstRow($event.target.value);
                    $event.target.value = 0;
                  "
                >
                  <option value="0" selected hidden>Schüler auswählen</option>

                  <option v-for="o in getNames()" :key="o">{{ o }}</option>
                </select>
                <!-- <button class="btn ruleBtn" @click="addRule(nearbyRules)">Neue Regel</button> -->
              </div>
            </transition>

            <!-- notBackRow rules start -->

            <button class="btn subBtn" @click="notBackRulesVisible = !notBackRulesVisible">
              Nicht nach hinten&nbsp;&nbsp;
              <i v-if="!notBackRulesVisible" class="arrowdown" />
              <i v-if="notBackRulesVisible" class="arrowup" />
            </button>
            <transition name="openTransition">
              <div class="ruleTypeDiv" v-if="notBackRulesVisible">
                <div class="firstRowRulesWrap">
                  <div class="singleRuleDiv firstRowRule" v-for="(_, i) in notBackRules.length" :key="i">
                    <button class="deleteRule" @click="deleteRuleAt(parseInt(i), notBackRules)">X</button>
                    {{ notBackRules[i] }}
                  </div>
                </div>
                <select
                  class="ruleSelect"
                  style="width: 100%; height: 100%; margin-bottom: 2%; padding-bottom: 2%; text-align: center"
                  @change="
                    addNotBackRow($event.target.value);
                    $event.target.value = 0;
                  "
                >
                  <option value="0" selected hidden>Schüler auswählen</option>

                  <option v-for="o in getNames()" :key="o">{{ o }}</option>
                </select>
                <!-- <button class="btn ruleBtn" @click="addRule(nearbyRules)">Neue Regel</button> -->
              </div>
            </transition>
          </div>
        </transition>
      </div>

      <button name="compute" @click="computePlan" class="btn submit">Plan erstellen</button>
      <button name="compute" @click="resetNamesOnPlan()" class="btn submit">Namen zurücksetzen</button>
      <span class="credits creditsWrap"
        >{{ "\n" }}Entwickelt von: {{ "\n" }}
        <a class="credits creditsA" href="https://github.com/Florik3ks" target="_blank">Florian E.</a>
        &
        <a class="credits creditsA" href="https://github.com/1td" target="_blank"> Joshua J.</a>
        {{ "\n" }}mit Hilfe von
        <a class="credits creditsA" href="https://github.com/PlisJan" target="_blank">Jan P.</a>
        {{ "\n" }}
        {{ "\n" }}<a class="credits creditsA" href="https://www.gymnasium-oberstadt.de/" target="_blank">GMO</a> 13 Informatik-LK (2022){{ "\n" }}unter der Leitung von Herrn Meß
      </span>
    </div>

    <div class="tafelDivOuter">
      <div class="tafelDivInner">TAFEL</div>
    </div>
    <div class="sitzplatzdiv">
      <div class="fieldBtnContextMenuDiv" v-if="fieldBtnContextMenuOpen" v-on:blur="fieldBtnContextMenuOpen = false" :style="{ top: contextMenuTop, left: contextMenuLeft }">
        <select
          class="fieldBtnContextSelect"
          @change="
            changeFieldBtnText($event.target.value);
            fieldBtnContextMenuOpen = false
          "
        >
          <option value="0" selected hidden>Schüler auswählen</option>
          <option>  </option>
          <option v-for="o in getNames()" :key="o">{{ o }}</option>
        </select>
      <button class="closeContextSelect" @click="fieldBtnContextMenuOpen = false">X</button>
      </div>

      <table>
        <tr v-for="(_, y) in parseInt(gridHeight)" :key="y">
          <td
            v-for="(_, x) in parseInt(gridWidth)"
            :key="x"
            class="t1"
            @contextmenu.prevent
            :style="{
              height: 85 / parseInt(gridHeight) + 'vh',
              border: !isMarked(x, y) ? 'lightgrey 1px solid' : 'black 1px solid',
              'border-bottom': isMarked(x, y + 1) ? 'black 1px solid' : 'lightgrey 1px solid',
              'border-right': isMarked(x + 1, y) ? 'black 1px solid' : 'lightgrey 1px solid',
              'border-top': isMarked(x, y) ? 'black 1px solid' : 'lightgrey 1px solid',
              'border-left': isMarked(x, y) ? 'black 1px solid' : 'lightgrey 1px solid',
            }"
          >
            <button
              :key="sitzplaetze"
              class="fieldBtn"
              @mousedown.left="onFieldClick(x, y)"
              @mouseenter="onFieldClickWhenMouseIsDown(x, y)"
              @contextmenu.prevent="onFieldContextMenu($event, x,y)"
              :style="{
                'font-size': 'medium',
                'background-color': isMarked(x, y) ? 'lightblue' : 'white',
                border: isMarked(x, y) ? 'black 2px solid' : 'none',
                'border-left': isMarked(x, y) ? (isMarked(x - 1, y) ? 'none' : 'black 1px solid') : 'none',
                'border-top': isMarked(x, y) ? (isMarked(x, y - 1) ? 'none' : 'black 1px solid') : 'none',
              }"
              v-text="sitzplaetze[x.toString() + ',' + y.toString()].name"
            ></button>
            <!-- <span style="display: inline-block; height: 100%; text-align: left;align-content:center;">
                {{ sitzplaetze[x.toString() + "," + y.toString()].name }}
              </span> -->
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" src="@/Sitzplatzplaner.ts" />

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="@/style.css" />
