export default {
  showDeleteModal: function (id) {
    this.deleteId = id
    this.$refs.deleteModal.$refs.confirmationModal.show()
  },
  hideDeleteModal: function () {
    this.deleteId = -1
    this.$refs.deleteModal.$refs.confirmationModal.hide()
  },
  showReturnModal: function (returnTo) {
    this.returnTo = returnTo
    this.$refs.returnModal.$refs.confirmationModal.show()
  },
  hideReturnModal: function () {
    this.returnConfirmed = false
    this.$refs.returnModal.$refs.confirmationModal.hide()
  },
  hideImportModal: function () {
    this.$refs.fileDialogModal.hide()
  }
}
