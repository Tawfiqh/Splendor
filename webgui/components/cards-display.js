Vue.component('cards-display', {
    props: {
        cards: { default: function () { return []; } },
        name: { default: '' },
        tier: { default: '1' },
        player: { default: null },
        show_reserve_button: { type: Boolean, default: false },
        num_cards: { type: Number, default: 4 },
        show_card_buttons: { type: Boolean, default: false },
        deck_count: { type: Number, default: 0 },
    },
    methods: {
        reserve: function (card) {
            var card_index;
            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i] === card) {
                    card_index = i;
                }
            }
            this.$emit('reserve', [this.tier, card_index]);
        },
        buy: function (card) {
            var card_index;
            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i] === card) {
                    card_index = i;
                }
            }
            this.$emit('buy', [this.tier, card_index, this.player.can_afford(card)[1]]);
        },
        reserve_from_deck: function () {
            this.$emit('reserve', [this.tier, -1]);
        },
    },
    computed: {
        show_deck_slot: function () {
            return this.show_reserve_button && this.tier !== 'hand';
        },
        total_slots: function () {
            var n = this.num_cards;
            if (this.show_deck_slot) {
                n += 1;
            }
            return n;
        },
        card_width: function () {
            var n = this.total_slots;
            return ((100 - n * 2) / n).toString() + '%';
        },
    },
    template: `
<div class="cards-display">
    <ul class="single-line-list">
      <tier-deck-slot
          v-if="show_deck_slot"
          v-bind:name="name"
          v-bind:tier="tier"
          v-bind:style="{width:card_width,maxWidth:card_width,minWidth:card_width}"
          v-bind:deck_count="deck_count"
          v-bind:show_reserve_button="show_reserve_button"
          v-bind:show_card_buttons="show_card_buttons"
          v-bind:player="player"
          v-on:reserve-deck="reserve_from_deck">
      </tier-deck-slot>
      <card-display
          v-bind:style="{width:card_width,maxWidth:card_width,minWidth:card_width}"
          v-for="card in cards"
          v-bind:show_reserve_button="show_reserve_button"
          v-bind:show_card_buttons="show_card_buttons"
          v-bind:player="player"
          v-bind:key="card.id"
          v-bind:card="card" 
          v-on:buy="buy($event)"
          v-on:reserve="reserve($event)">
      </card-display>
    </ul>
</div>
`
});
