Vue.component('supply-display', {
    props: ['gems', 'show_card_count', 'nobles'],
    computed: {
        num_gems: function () {
            let total = 0;
            for (let colour of colours) {
                total += this.gems[colour];
            }
            return total;
        }
    },
    template: `
<div class="supply-display">
    <h3>Supply: {{ num_gems }} coloured gems</h3>
    <gems-table v-bind:gems="gems"
                v-bind:show_card_count="show_card_count">
    </gems-table>
</div>
`
});
