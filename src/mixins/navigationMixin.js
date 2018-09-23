export const navigationMixin = {
  methods: {
    confirmReturn (returnTo, el) {
      this.returnConfirmed = true
      this.goNavigate(returnTo, el)
    },
    goNavigate (returnTo, el) {
      if (returnTo) this.returnTo = returnTo
      if (!this.dirtyCheck(el) || this.returnConfirmed) {
        this.$router.push(this.returnTo)
      } else {
        this.showReturnModal(this.returnTo)
      }
    },
    dirtyCheck (el) {
      return this.isEdit && !this._.isEqual(this.cleanObject, el)
    }
  }
}
