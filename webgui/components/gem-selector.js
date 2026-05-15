Vue.component('gem-selector', {
    props: ['supply_gems', 'gems', 'player_gems', 'player_cards'],
    computed: {
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
        }
    },
    template: `
<div class="gem-selector">
  <div class="card gem-selector-card--hand">
    <p class="card-title">Your gems &amp; cards</p>
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

        <gems-table-gem-counter v-for="(number, colour) in gems"
            v-bind:key="colour"
            v-bind:colour="colour"
            v-bind:number="number">
        </gems-table-gem-counter>
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
