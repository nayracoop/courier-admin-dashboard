<template>
  <b-modal id="modal-confirm" ref="deleteModal" hide-footer centered title="Confirmación">
    <p class="my-2 mb-4 text-center">¿Desea eliminar definitivamente {{ count > 1 ? `los ${count} registros seleccionados` : 'el registro seleccionado' }}?</p>
    <b-row>
      <b-col sm="12 text-center" slot="modal-footer">
        <b-button variant="primary" @click="onCancel">No, volveré atrás</b-button>
        <b-button variant="danger" @click="onConfirm">Sí, deseo eliminarlo{{ count > 1 ? 's' : '' }}</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'c-confirmation-modal',
  props: [ 'count' ],
  methods: {
    onConfirm () {
      this.$emit('confirm')
    },
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
