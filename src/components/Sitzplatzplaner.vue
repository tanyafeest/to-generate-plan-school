<template>
  <div class="presetDiv" v-if="presetPageOpen">
    <div class="presetContent">
      <button class="closePresetContent" @click="presetPageOpen = false">X</button>
      <button v-for="(_, i) in parseInt(presetCount)" :key="i" class="presetBtn" @click="setPreset(i)">
        <img :src="require(`@/assets/preset${i}.png`)" class="presetImg" />
      </button>
    </div>
  </div>
  <div class="presetDiv" v-if="loadingDivOpen" >
    <div class="lds-default" ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
  <div @mousedown.left="isMouseDown = true" @mouseup.left="isMouseDown = false" id="wrapperDiv">
    <div class="sideDiv">
      <div class="sliderDiv">
        <div class="sliderInformationDiv">
          <span style="line-height: 25px; padding-top: 31px"> {{ gridWidth }} * {{ gridHeight }}<br />{{ getNumberOfFields() }} Sitzplätze</span>
        </div>
        <div class="verticalSliderDiv"><input type="range" name="gridHeight" v-model="gridHeight" min="5" :max="maxGridHeight" class="inpSlider verticalSlider" /></div>
        <input type="range" name="gridWidth" v-model="gridWidth" min="5" :max="maxGridWidth" class="inpSlider horizontalSlider" />
      </div>
      <div>
        <button @click="presetPageOpen = true" class="openPresetBtn">Raumvorlagen öffnen</button>
      </div>

      <div class="studentFieldWrap">
        <button class="btn" @click="studentFieldVisible = closeEverythingExcept(studentFieldVisible)">
          Namen der Schüler&nbsp;&nbsp;
          <i v-if="!studentFieldVisible" class="arrowdown" />
          <i v-if="studentFieldVisible" class="arrowup" />
        </button>
        <transition name="openTransition">
          <div v-if="studentFieldVisible" class="studentFieldDiv">
            <input class="className" type="text" placeholder="Name der Klasse" v-model="className"/>
            <textarea v-if="studentFieldVisible" class="studentField" v-model="studentFieldValue" placeholder="Name 1" @blur="checkForDoubleNames"> </textarea>
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
          <div class="ruleDiv" v-if="ruleVisible">
            <!-- avoidRules start -->
            <button class="btn subBtn" @click="avoidRulesVisible = !avoidRulesVisible">
              Dürfen <strong>nicht</strong> nebeneinander&nbsp;&nbsp;
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
            <button class="btn subBtn" @click="nearbyRulesVisible = !nearbyRulesVisible">
              Sollen nebeneinander&nbsp;&nbsp;
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
            <button class="btn subBtn" @click="firstRowRulesVisible = !firstRowRulesVisible">
              Nach vorne&nbsp;&nbsp;
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
              </div>
            </transition>

            <!-- notBackRow rules start -->

            <button class="btn subBtn" @click="notBackRulesVisible = !notBackRulesVisible">
              <strong> Nicht </strong> nach hinten&nbsp;&nbsp;
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
              </div>
            </transition>
          </div>
        </transition>
      </div>

      <div class="algorithmFieldWrap">
        <button class="btn" @click="algorithmSettingsVisible = closeEverythingExcept(algorithmSettingsVisible)">
          Einstellungen&nbsp;&nbsp;
          <i v-if="!algorithmSettingsVisible" class="arrowdown" />
          <i v-if="algorithmSettingsVisible" class="arrowup" />
        </button>
        <transition name="openTransition">
          <div v-if="algorithmSettingsVisible" class="algorithmSettingsDiv">
            <p style="display:inline-block; padding-right: 10px;">
              <span style="vertical-align: middle;padding-right:10px">Stufe der Zufälligkeit:</span>
              <input style="vertical-align: middle;" type="range" min="0" max="2" v-model="algorithmRandomness"/>
              <span style="vertical-align: middle;">{{ algorithmRandomness }}</span>
            </p>
            <p style="display:inline-block; padding-right: 10px;">
              <input type="checkbox" style="height:20px;width:20px;vertical-align: middle;" v-model="highlightManuallySelected"/>
               <span style="vertical-align: middle;">Manuell ausgewählte Schüler hervorheben</span>
            </p>
          </div>
        </transition>
      </div>

      <button @click="computePlan" class="btn submit">Plan erstellen</button>
      <button @click="resetNamesOnPlan" class="btn submit">Namen zurücksetzen</button>
      <button @click="downloadPlan" class="btn submit">Bild herunterladen</button>
      <form action="mailto:Florik3ks@gmail.com">
        <button class="btn submit" type="submit" style="font-size:medium;">
            Feedback / Fragen / Fehler ?
        </button>
      </form>
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

    <div id="sitzplan">
    <div class="tafelDivOuter">
      <div class="tafelDivInner" id="tafel" >TAFEL</div>
    </div>
    <div class="sitzplatzdiv">
      <div class="fieldBtnContextMenuDiv" v-if="fieldBtnContextMenuOpen" v-on:blur="fieldBtnContextMenuOpen = false" :style="{ top: contextMenuTop, left: contextMenuLeft }">
        <select
          id="fieldSelectionID"
          class="fieldBtnContextSelect"
          @change="
            manuallySelectStudent($event.target.value);
            fieldBtnContextMenuOpen = false
          "
          @blur="fieldBtnContextMenuOpen = false"
        >
          <option value="0" selected hidden>Schüler auswählen</option>
          <option> </option>
          <option v-for="o in getNames()" :key="o">{{ o }}</option>
        </select>
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
              border: !isMarked(x, y) ? 'lightgrey 2px solid' : 'black 1px solid',

            }"
          >
            <button
              :key="sitzplaetze"
              class="fieldBtn"
              @mousedown.left="onFieldClick(x, y)"
              @mouseenter="onFieldClickWhenMouseIsDown(x, y)"
              @contextmenu.prevent="onFieldContextMenu($event, x,y)"
              @touchstart="touchstart(x,y)"
              @touchend="touchend($event, x,y)"
              :style="{
                'font-size': 'medium',
                'background-color': isMarked(x, y) ? (isManuallySelected(x,y) ? highlightManuallySelected ? 'skyblue' : 'lightblue' : 'lightblue') : 'white',
                border: isMarked(x, y) ? 'black 2px solid' : 'none',
              }"
              v-text="sitzplaetze[x.toString() + ',' + y.toString()].name"
            ></button>
          </td>
        </tr>
      </table>
    </div>
    </div>
  </div>
</template>

<script lang="ts" src="@/Sitzplatzplaner.ts" />

<style scoped src="@/style.css" />
