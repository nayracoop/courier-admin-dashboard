<template>
  <b-modal :class="classModal" :id="defaultStyles ? '' : 'modal-confirm'" ref="confirmationModal" centered :title="modalTitle">
    <b-row>
      <b-col :class="{ 'col-md-10':!defaultStyles, 'text-center':!defaultStyles, 'prompt-col':!defaultStyles }">
        <p>{{ promptMessage }}</p>
      </b-col>
    </b-row>
    <!-- ¿Desea eliminar definitivamente {{ count > 1 ? `los ${count} registros seleccionados` : 'el registro seleccionado' }}? -->
    <div slot="modal-footer">
        <b-button variant="secondary" @click="onCancel">{{ cancellationMessage }}</b-button>
        <b-button :variant="variantConfirmation" @click="onConfirm"><i v-if="waiting" class="fa fa-cog fa-spin ml-1"></i> {{ confirmationMessage }}</b-button>
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
    modalTitle: { type: String, default: '' },
    variantConfirmation: { type: String, default: 'danger' },
    confirmationMethod: { type: String, default: 'confirm' },
    cancellationMethod: { type: String, default: 'cancel' },
    defaultStyles: false
  },
  data () {
    return {
      waiting: false
    }
  },
  methods: {
    onConfirm () {
      this.$emit(this.confirmationMethod)
    },
    onCancel () {
      this.$emit(this.cancellationMethod)
    },
    wait () {
      this.waiting = true
    },
    stopWaiting () {
      this.waiting = false
    }
  }
}
</script>
