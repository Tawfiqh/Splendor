Vue.component('increment-button', {
    props: ['colour', 'enabled', 'show_button'],
    computed: {
        show: function () {
            if (this.show_button) {
                return 1;
            }
            return 0;
        }
    },
    template: `
<td class="increment-button">
  <button v-bind:disabled="!enabled"
          v-bind:style="{opacity:show}"
          v-on:click="$emit('increment', colour)">
    +
  </button>
</td>
`
});

Vue.component('decrement-button', {
    props: ['colour', 'enabled', 'show_button'],
    computed: {
        show: function () {
            if (this.show_button) {
                return 1;
            }
            return 0;
        }
    },
    template: `
<td class="decrement-button">
  <button v-bind:disabled="!enabled"
          v-bind:style="{opacity:show}"
          v-on:click="$emit('decrement', colour)">
    -
    </button>
</td>
`
});
