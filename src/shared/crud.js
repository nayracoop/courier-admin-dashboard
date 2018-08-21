export default {
  save: function (el, action, redirectTo) {
    let $this = this
    if ($this.isEdit && !$this.dirtyCheck(el)) {
      $this.$toasted.global.error_toast({ message: 'El registro no fue editado' })
      return false
    }
    $this.inProgress = true
    $this.$store
      .dispatch(action)
      .then(savedObject => {
        let jsonObject = savedObject.toJSON()
        this.cleanObject = this._.cloneDeep(jsonObject, true)

        $this.$router.push({
          name: redirectTo,
          params: { id: savedObject.id }
        })
        $this.$eventHub.$emit('saveSuccess', savedObject)
        $this.$toasted.global.success_toast({ message: $this.isEdit ? 'Registro editado con éxito' : 'Registro creado con éxito' })
        $this.inProgress = false
      }, error => {
        $this.$toasted.global.error_toast({ message: error })
        $this.inProgress = false
      })
  },
  deleteEl: function (action, redirectTo) {
    this.inProgress = true
    this.$store
      .dispatch(action, this.deleteId)
      .then(res => {
        this.inProgress = false
        this.deleteId = -1
        this.$router.push(redirectTo)
        this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
      }, error => {
        this.inProgress = false
        this.deleteId = -1
        this.$toasted.global.error_toast({ message: error })
      })
  }
}
