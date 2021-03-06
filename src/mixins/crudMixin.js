export const crudMixin = {
  methods: {
    save (el, action, redirectTo) {
      let $this = this
      if ($this.isEdit && !$this.dirtyCheck(el)) {
        $this.$toasted.global.error_toast({ message: 'El registro no fue editado' })
        return false
      }
      $this.inProgress = true
      $this.$store
        .dispatch(action)
        .then(savedObject => {
          const jsonObject = savedObject.constructor === Object ? savedObject : savedObject.toJSON()
          const id = jsonObject.id ? jsonObject.id : jsonObject.objectId
          this.cleanObject = this._.cloneDeep(jsonObject, true)
          $this.$router.push({
            name: redirectTo,
            params: { id }
          })
          $this.$eventHub.$emit('saveSuccess', savedObject)
          $this.$toasted.global.success_toast({ message: $this.isEdit ? 'Registro editado con éxito' : 'Registro creado con éxito' })
          $this.inProgress = false
        }, error => {
          console.error('crudMixin', error)
          $this.$toasted.global.error_toast({ message: error })
          $this.inProgress = false
        })
    },
    deleteEl (action, redirectTo) {
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
}
