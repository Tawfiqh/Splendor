function noble_string(noble) {
    let string = '<span class="bold">3: </span>';
    let first = true;
    for (let colour of colours) {
        if (colour in noble.cards && noble.cards[colour] > 0) {
            if (!first) {
                string += ', ';
            }
            string += '<span class="' + colour + '">' + noble.cards[colour] + ' ' + colour + '</span>';
            first = false;
        }
    }
    return string;
}

Vue.component('nobles-display', {
    props: ['nobles'],
    computed: {
        noble_strings: function () {
            let strings = [];
            for (let noble of this.nobles) {
                strings.push(noble_string(noble));
            }
            return strings;
        },
    },
    template: `
<div v-if="noble_strings.length" class="nobles-display card">
    <p class="card-title">Nobles</p>
    <ul class="nobles-list">
        <li v-for="noble_string in noble_strings"><span v-html="noble_string"></span></li>
    </ul>
</div>
`
});
