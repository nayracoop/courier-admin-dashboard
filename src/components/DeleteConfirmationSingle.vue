<template>
  <b-modal id="modal-confirm" ref="deleteModal" hide-footer centered title="Confirmación">
    <p class="my-2 mb-4 text-center">¿Desea eliminar definitivamente este registro?</p>
    <b-row>
      <b-col sm="12 text-center" slot="modal-footer">
        <b-button variant="primary" @click="onCancel">No, volveré atrás</b-button>
        <b-button variant="danger" @click="onConfirm">Sí, deseo eliminarlo</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'c-single-delete',
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
