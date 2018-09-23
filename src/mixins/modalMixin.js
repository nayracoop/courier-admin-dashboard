export const modalMixin = {
  methods: {
    showDeleteModal (id) {
      this.deleteId = id
      this.$refs.deleteModal.$refs.confirmationModal.show()
    },
    hideDeleteModal () {
      this.deleteId = -1
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    showReturnModal (returnTo) {
      this.returnTo = returnTo
      this.$refs.returnModal.$refs.confirmationModal.show()
    },
    hideReturnModal () {
      this.returnConfirmed = false
      this.$refs.returnModal.$refs.confirmationModal.hide()
    },
    hideImportModal () {
      this.$refs.fileDialogModal.hide()
    }
  }
}
