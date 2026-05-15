Vue.component('column-right-layout', {
    template: `
<div class="column-right-layout">
    <div class="column-right-main">
        <slot></slot>
    </div>
    <div class="column-right-sidebar">
        <div class="column-right-sidebar-top">
            <slot name="sidebar-top"></slot>
        </div>
        <div class="column-right-sidebar-bottom">
            <slot name="sidebar-bottom"></slot>
        </div>
    </div>
</div>
`
});
