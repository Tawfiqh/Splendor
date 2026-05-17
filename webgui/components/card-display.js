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
        buy_button_top: function () {
            if (this.show_reserve_button) {
                return "26%";
            }
            return "5%";
        },
    },
    template: `
<li class="card-display">
<div class="card-display-contents" v-bind:style="{ background: card_background }">
    <div class="card-display-top-row">
        <p v-if="card.points > 0" class="card-points" aria-label="Victory points">{{ card.points }}</p>
        <button class="reserve-button"
                v-if="show_reserve_button && show_card_buttons && reservable"
                v-bind:disabled="!reservable"
                v-on:click="$emit('reserve', card)">
            reserve
        </button>
        <button class="buy-button"
                v-if="show_card_buttons && buyable"
                v-bind:disabled="!buyable"
                v-bind:style="{top: buy_button_top}"
                v-on:click="$emit('buy', card)">
            buy
        </button>
    </div>
    <gems-list v-bind:gems="card.gems" 
               v-bind:display_zeros="false">
    </gems-list>
</div>
</li>
`
});
