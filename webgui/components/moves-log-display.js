function moveToHtml(move) {
    let action = move['action'];
    let html = '';
    if (action === 'gems') {
        html += 'took gems: ';
        let gems = move['gems'];
        for (let colour of all_colours) {
            if (colour in gems && gems[colour] != 0) {
                let number = gems[colour];
                html += '<span class="' + colour + '">' + number + '</span>&nbsp;';
            }
        }
    } else if (action === 'reserve') {
        let card = move['card'];
        html += 'reserved ' + card.points + ' point <span class="' + card.colour + '">' + card.colour + '</span> card costing ';
        for (let colour of colours) {
            if (colour in card.gems && card.gems[colour] != 0) {
                let number = card.gems[colour];
                html += '<span class="' + colour + '">' + number + '</span>&nbsp;';
            }
        }
        html += 'from tier ' + move['tier'];
        if (move['gems']['gold'] != 0) {
            html += ', gaining <span class="gold">' + move['gems']['gold'] + '</span>';
        }
    } else if (action === 'buy_reserved' || action === 'buy_available') {
        let card = move['card'];
        html += 'bought ' + card.points + ' point <span class="' + card.colour + '">' + card.colour + '</span> card costing ';
        for (let colour of colours) {
            if (colour in card.gems && card.gems[colour] != 0) {
                let number = card.gems[colour];
                html += '<span class="' + colour + '">' + number + '</span>&nbsp;';
            }
        }
        if (action === 'buy_reserved') {
            html += 'from hand for ';
        } else {
            html += 'from tier ' + move['tier'] + ' for ';
        }
        let cost = move['gems'];
        let was_free = true;
        for (let colour of all_colours) {
            if (colour in cost && cost[colour] != 0) {
                let number = cost[colour];
                was_free = false;
                html += '<span class="' + colour + '">' + number + '</span>&nbsp;';
            }
        }
        if (was_free) {
            html += 'free';
        }
    }
    return html;
}

Vue.component('moves-log-display', {
    props: ['moves'],
    computed: {
        move_strings: function () {
            let strs = [];
            for (let i = this.moves.length - 1; i >= 0; i--) {
                let move = this.moves[i];
                let round = math.floor(i / 2) + 1;
                let player = (i % 2) + 1;

                let html = moveToHtml(move);
                strs.push('<span class="bold">R' + round + ' P' + player + ':</span> ' + html);
            }
            return strs;
        }
    },
    watch: {
        'moves.length': function () {
            this.scrollLogToTop();
        }
    },
    mounted: function () {
        this.scrollLogToTop();
    },
    methods: {
        scrollLogToTop: function () {
            this.$nextTick(function () {
                var el = this.$refs.movesLogScroll;
                if (el) {
                    el.scrollTop = 0;
                }
            }.bind(this));
        }
    },
    template: `
<div class="moves-log-display">
    <h3 class="moves-log-display-title">Moves log</h3>
    <div ref="movesLogScroll"
         class="moves-log-scroll">
        <p v-if="moves.length === 0"
           class="moves-log-empty">No moves yet.</p>
        <ul v-else
            class="moves-log-list">
            <li v-for="(line, index) in move_strings"
                v-bind:key="index"
                class="moves-log-row"
                v-bind:class="{ 'moves-log-row--last': index === 0 }">
                <span v-html="line"></span>
            </li>
        </ul>
    </div>
</div>
`
});
