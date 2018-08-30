<template>
  <b-modal :class="classModal" id="modal-confirm" ref="confirmationModal" centered :title="modalTitle">
    <p>{{ promptMessage }}</p>
    <!-- ¿Desea eliminar definitivamente {{ count > 1 ? `los ${count} registros seleccionados` : 'el registro seleccionado' }}? -->
    <div slot="modal-footer">
        <b-button variant="secondary" @click="onCancel">{{ cancellationMessage }}</b-button>
        <b-button variant="danger" @click="onConfirm">{{ confirmationMessage }}</b-button>
        <!-- Sí, deseo eliminarlo{{ count > 1 ? 's' : '' }} -->
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'c-confirmation-modal',
  props: {
    classModal: { type: String, default: 'default-modal' },
    promptMessage: { type: String, default: '¿Desea continuar?' },
    confirmationMessage: { type: String, default: 'Sí, deseo continuar' },
    cancellationMessage: { type: String, default: 'Cancelar' },
    modalTitle: { type: String, default: 'Confirmación' },
    confirmationMethod: { type: String, default: 'confirm' },
    cancellationMethod: { type: String, default: 'cancel' }
  },
  methods: {
    onConfirm () {
      this.$emit(this.confirmationMethod)
    },
    onCancel () {
      this.$emit(this.cancellationMethod)
    }
  }
}
</script>
