Vue.component('move-maker', {
    props: ['player', 'supply_gems', 'gems', 'player_gems', 'player_cards'],
    methods: {
        take_gems: function () {
            this.$emit('take_gems', this.gems);
        }
    },
    computed: {
        any_gems_selected: function () {
            var any_gems_in_supply = false;
            for (let colour of colours) {
                if (this.supply_gems[colour] > 0) {
                    any_gems_in_supply = true;
                    break;
                }
            }

            if (!any_gems_in_supply) {
                return true;  // no gems in supply, so can 'take gems'
                // without selecting any
            }

            var any_selected = false;
            for (let colour of colours) {
                if (this.gems[colour] > 0) {
                    any_selected = true;
                    break;
                }
            }
            return any_selected;
        }
    },
    template: `
<div class="move-maker">
  <gem-selector v-bind:supply_gems="supply_gems"
                v-bind:player_gems="player_gems"
                v-bind:player_cards="player_cards"
                v-bind:gems="gems">
  </gem-selector>
  <button v-on:click="take_gems()"
          v-bind:disabled="!any_gems_selected && false">
    take gems
  </button>
</div>
`
});
