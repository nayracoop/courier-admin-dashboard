<template>
  <footer :class="classList">
    <slot>
      <div>
        <span>Courier Admin Dashboard</span>
        <span>&copy; 2018</span>
      </div>
      <div class="ml-auto">
        <span>Desarrollado por</span>
        <a href="https://nayra.coop">nayra.coop</a>
      </div>
    </slot>
  </footer>
</template>

<script>
export default {
  name: 'DFooter',
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  },
  mounted: function () {
    this.isFixed()
  },
  computed: {
    classList () {
      return [
        'app-footer'
      ]
    }
  },
  methods: {
    isFixed () {
      this.fixed ? document.body.classList.add('footer-fixed') : document.body.classList.remove('footer-fixed')
    }
  }
}
</script>
