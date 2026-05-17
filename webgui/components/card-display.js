Vue.component('card-display', {
    props: ['card', 'player', 'show_reserve_button', 'show_card_buttons'],
    computed: {
        card_background: function () {
            var base = background_colours[this.card.colour];
            return 'linear-gradient(165deg, rgba(255,255,255,0.28) 0%, rgba(0,0,0,0.06) 100%), ' + base;
        },
        buyable: function () {
            return this.player.can_afford(this.card)[0];
        },
        reservable: function () {
            return (this.player.cards_in_hand.length < 3);
        },
        show_top_row: function () {
            if (this.card.points > 0) {
                return true;
            }
            if (!this.show_card_buttons) {
                return false;
            }
            if (this.buyable) {
                return true;
            }
            return this.show_reserve_button && this.reservable;
        },
        show_actions: function () {
            if (!this.show_card_buttons) {
                return false;
            }
            if (this.buyable) {
                return true;
            }
            return this.show_reserve_button && this.reservable;
        },
    },
    template: `
<li class="card-display">
<div class="card-display-contents" v-bind:style="{ background: card_background }">
    <div class="card-display-top-row" v-if="show_top_row">
        <div class="card-display-actions" v-if="show_actions">
            <button class="reserve-button"
                    v-if="show_reserve_button && reservable"
                    v-bind:disabled="!reservable"
                    v-on:click="$emit('reserve', card)">
                reserve
            </button>
            <button class="buy-button"
                    v-if="buyable"
                    v-bind:disabled="!buyable"
                    v-on:click="$emit('buy', card)">
                buy
            </button>
        </div>
        <p v-if="card.points > 0" class="card-points" aria-label="Victory points">{{ card.points }}</p>
    </div>
    <gems-list v-bind:gems="card.gems" 
               v-bind:display_zeros="false">
    </gems-list>
</div>
</li>
`
});
