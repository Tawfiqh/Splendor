Vue.component('gem-selector-draft-cell', {
  props: ['colour', 'number', 'in_supply', 'after_pick', 'show_supply_hint'],
  computed: {
    border_colour: function () {
      return border_colours[this.colour];
    },
    background_colour: function () {
      return background_colours[this.colour];
    },
    hint_line: function () {
      if (!this.show_supply_hint) {
        return '';
      }
      var pool = this.in_supply;
      var after = this.after_pick;
      var take = this.number;
      if (take === 0) {
        return pool === 1 ? '1 gem in supply' : pool + ' gems in supply';
      }
      var leftPart = pool + ' in supply';
      var rightPart = (after === 0 && take > 0) ? 'none left' : (after + ' after');
      return leftPart + ' · ' + rightPart;
    },
    cell_aria_label: function () {
      var n = this.number;
      var gemWord = n === 1 ? 'gem' : 'gems';
      var base = 'Taking ' + n + ' ' + this.colour + ' ' + gemWord;
      if (this.hint_line) {
        return base + '. ' + this.hint_line;
      }
      return base;
    },
    supply_dimmed: function () {
      return this.show_supply_hint && this.in_supply === 0;
    }
  },
  template: `
<td class="gem-selector-draft-cell"
    role="group"
    v-bind:aria-label="cell_aria_label">
  <div class="gem-selector-draft-stack">
    <div class="gem-selector-draft-disc"
         v-bind:style="{ background: background_colour, borderColor: border_colour }"
         aria-hidden="true">
      {{ number }}
    </div>
    <span v-if="hint_line"
          class="gem-selector-supply-hint"
          v-bind:class="{ 'gem-selector-supply-hint--empty': supply_dimmed }">
      {{ hint_line }}
    </span>
  </div>
</td>
`
});

Vue.component('gem-selector', {
  props: ['supply_gems', 'gems', 'player_gems', 'player_cards'],
  computed: {
    supply_after_pick: function () {
      var out = {};
      for (var colour in this.gems) {
        if (!Object.prototype.hasOwnProperty.call(this.gems, colour)) {
          continue;
        }
        var pool = this.supply_gems[colour] != null ? this.supply_gems[colour] : 0;
        var take = this.gems[colour] != null ? this.gems[colour] : 0;
        out[colour] = Math.max(0, pool - take);
      }
      return out;
    },
    can_increment: function () {
      var any_value_2 = false;
      var num_values_1 = 0;
      for (var i = 0; i < colours.length; i++) {
        var colour = colours[i];
        if (this.gems[colour] >= 2) {
          any_value_2 = true;
        }
        if (this.gems[colour] == 1) {
          num_values_1 += 1;
        }
      }
      var incrementable = {};
      for (var i = 0; i < colours.length; i++) {
        var colour = colours[i];
        incrementable[colour] = !any_value_2 && (
          (num_values_1 == 1 && this.gems[colour] == 1 && this.supply_gems[colour] > 3) ||
          ((num_values_1 < 3) && this.supply_gems[colour] > 0 && this.gems[colour] == 0));
      }
      return incrementable;
    },
    can_decrement: function () {
      var decrementable = {};
      for (var i = 0; i < colours.length; i++) {
        var colour = colours[i];
        decrementable[colour] = (this.gems[colour] > 0);
      }
      return decrementable;
    },
    show_button: function () {
      let show = {};
      for (let colour of colours) {
        if (this.supply_gems[colour] > 0) {
          show[colour] = true;
        } else {
          show[colour] = false;
        }
      }
      show['gold'] = false;
      return show;
    },
    total_player_gems: function () {
      let total = 0;
      for (let colour in this.player_gems) {
        total += this.player_gems[colour];
      }
      return total;
    }
  },
  template: `
<div class="gem-selector">
  <div class="card gem-selector-card--hand">
    <p class="card-title">Your gems <span class="gem-total">({{ total_player_gems }})</span>:</p>
    <table class="gem-selector-table">
      <tr>
        <gems-table-gem-counter v-for="(number, colour) in player_gems"
            v-bind:key="colour"
            v-bind:colour="colour"
            v-bind:number="number">
        </gems-table-gem-counter>
      </tr>
      <tr>

        <gems-table-card-counter v-for="(number, colour) in player_cards"
            v-bind:key="colour"
            v-bind:colour="colour"
            v-bind:number="number">
        </gems-table-card-counter>
      </tr>
    </table>
  </div>
  <div class="card gem-selector-card--supply">
    <p class="card-title">From the supply (this turn)</p>
    <table class="gem-selector-table">
      <tr>

        <gem-selector-draft-cell v-for="(number, colour) in gems"
            v-bind:key="colour"
            v-bind:colour="colour"
            v-bind:number="number"
            v-bind:in_supply="supply_gems[colour] != null ? supply_gems[colour] : 0"
            v-bind:after_pick="supply_after_pick[colour]"
            v-bind:show_supply_hint="colour !== 'gold'">
        </gem-selector-draft-cell>
      </tr>
      <tr>

        <increment-button v-for="(number, colour) in gems"
                          v-bind:key="colour"
                          v-bind:enabled="can_increment[colour]"
                          v-bind:show_button="show_button[colour]"
                          v-on:increment="gems[$event] += 1"
                          v-bind:colour="colour">
        </increment-button>
      </tr>
      <tr>
       
        <decrement-button v-for="(number, colour) in gems"
                          v-bind:key="colour"
                          v-bind:enabled="can_decrement[colour]"
                          v-bind:show_button="show_button[colour]"
                          v-on:decrement="gems[$event] -= 1"
                          v-bind:colour="colour">
        </decrement-button>
      </tr>
    </table>
  </div>
</div>
`
});
