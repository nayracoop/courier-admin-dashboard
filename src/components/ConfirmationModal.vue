<template>
  <b-modal id="modal-confirm" ref="confirmationModal" hide-footer centered :title="title">
    <p class="my-2 mb-4 text-center">{{ promptMessage }}</p>
    <!-- ¿Desea eliminar definitivamente {{ count > 1 ? `los ${count} registros seleccionados` : 'el registro seleccionado' }}? -->
    <b-row>
      <b-col sm="12 text-center" slot="modal-footer">
        <b-button variant="primary" @click="onConfirm">{{ confirmationMessage }}</b-button>
        <b-button variant="danger" @click="onCancel">{{ cancellationMessage }}</b-button>
        <!-- Sí, deseo eliminarlo{{ count > 1 ? 's' : '' }} -->
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'c-confirmation-modal',
  props: {
    promptMessage: { type: String, default: '¿Desea continuar?' },
    confirmationMessage: { type: String, default: 'Sí, deseo continuar' },
    cancellationMessage: { type: String, default: 'No, volveré atrás' },
    title: { type: String, default: 'Confirmación' },
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
