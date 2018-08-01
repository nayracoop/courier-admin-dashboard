<template>
  <b-modal id="modal-confirm" ref="deleteModal" hide-footer centered title="Confirmación">
    <p class="my-2 mb-4 text-center">El registro fue modificado ¿Desea volver atrás y perder los cambios?</p>
    <b-row>
      <b-col sm="12 text-center" slot="modal-footer">
        <b-button variant="primary" @click="onCancel">No, deseo continuar editando</b-button>
        <b-button variant="danger" @click="onConfirm">Sí, descarto los cambios</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'c-return-confirmation-modal',
  methods: {
    onConfirm () {
      this.$emit('confirmReturn')
    },
    onCancel () {
      this.$emit('cancelReturn')
    }
  }
}
</script>
