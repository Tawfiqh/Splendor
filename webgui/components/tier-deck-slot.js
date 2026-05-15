Vue.component('tier-deck-slot', {
    props: {
        name: { default: '' },
        tier: { default: '1' },
        deck_count: { type: Number, default: 0 },
        show_reserve_button: { type: Boolean, default: false },
        show_card_buttons: { type: Boolean, default: false },
        player: { default: null },
    },
    computed: {
        can_reserve: function () {
            return this.player && this.player.cards_in_hand.length < 3;
        },
        deck_clickable: function () {
            return this.show_reserve_button &&
                this.show_card_buttons &&
                this.can_reserve &&
                this.deck_count > 0;
        },
        tier_inner_class: function () {
            var t = parseInt(this.tier, 10);
            if (t === 1 || t === 2 || t === 3) {
                return 'tier-deck-slot-inner--tier-' + t;
            }
            return 'tier-deck-slot-inner--tier-1';
        },
    },
    methods: {
        on_click: function () {
            if (this.deck_clickable) {
                this.$emit('reserve-deck');
            }
        },
    },
    template: `
<li class="tier-deck-slot">
<button type="button"
        class="tier-deck-slot-inner"
        v-bind:class="tier_inner_class"
        v-bind:disabled="!deck_clickable"
        v-bind:title="deck_clickable ? 'Reserve top card from deck' : ''"
        v-on:click="on_click">
    <h3>{{ name }}</h3>
    <span class="tier-deck-count">{{ deck_count }}</span>
</button>
</li>
`
});
