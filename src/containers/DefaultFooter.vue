<template>
  <footer :class="classList">
    <slot>
      <div>
        <span>Courier Admin Dashboard</span>
        <span>&copy; {{theYear}}</span>
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
    },
    theYear () {
      return new Date().getFullYear()
    }
  },
  methods: {
    isFixed () {
      this.fixed ? document.body.classList.add('footer-fixed') : document.body.classList.remove('footer-fixed')
    }
  }
}
</script>
