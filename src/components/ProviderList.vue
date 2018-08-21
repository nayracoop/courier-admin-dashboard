<template>
  <b-card :header="caption">
    <template>
      <b-row class="actions-bar">
        <b-col sm="6">
          <b-button variant="primary" :to="{ name: 'Nuevo Proveedor' }">Nuevo proveedor <i class="fa fa-plus-circle ml-1"></i></b-button>
          <b-button variant="outline-danger" @click="showDeleteModal()" v-b-modal.modal-center>Eliminar <i class="fa fa-trash ml-1"></i></b-button>
          <b-button variant="outline-primary" disabled>Importar <i class="fa fa-file ml-1"></i></b-button>
        </b-col>
        <b-form-group class="ml-auto col-6">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-row>
    </template>
    <!-- tabla -->
    <b-table :hover="true" :striped="true" :bordered="true" :small="true" :fixed="true" :items="providers" :fields="fields"
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues" @head-clicked="clearSelected">

      <template slot="HEAD_selection" slot-scope="head">
        <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
      </template>

      <template slot="selection" slot-scope="data">
        <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
      </template>

      <template slot="actions" slot-scope="data">
        <b-button v-b-tooltip.hover title="Editar registro" variant="primary" :to="{ name: 'Editar Proveedor', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button v-b-tooltip.hover title="Nuevo envío" :small="true" :to="{ name: 'Nuevo Envío' }" :disabled="!data.item.isShipping">
          <i class="fa fa-plane"></i>
        </b-button>
        <b-button v-b-tooltip.hover title="Eliminar registro" class="btn-danger" :small="true" @click="showDeleteModal(data.item.objectId)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <!-- end tabla -->
    <nav>
      <b-pagination :total-rows="providersCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
        hide-goto-end-buttons @click.native="clearSelected" />
    </nav>
    <c-confirmation-modal :promptMessage="'¿Desea eliminar definitivamente ' + (deleteMultiple && checkedItems.length > 1 ? `los ${checkedItems.length} registros seleccionados` : 'el registro seleccionado') + '?'"
      ref="deleteModal" title="Confirmación"
      :confirmationMessage="'Sí, deseo eliminarlo' + (deleteMultiple && checkedItems.length > 1 ? 's' : '')"
      cancellationMessage="No, volveré atrás"
      confirmationMethod="confirmDelete" cancellationMethod="cancelDelete"
      @confirmDelete="confirmDelete" @cancelDelete="hideDeleteModal" />
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_PROVIDERS, IMPORT_PROVIDERS, PROVIDER_DELETE } from '@/store/types/actions'
import CConfirmationModal from '@/components/ConfirmationModal'

export default {
  name: 'c-provider-list',
  components: { CConfirmationModal },
  props: { caption: { type: String, default: 'Proveedores' } },
  data: () => {
    return {
      fields: [ 'selection',
        { key: 'name', label: 'Nombre', sortable: true, editable: true },
        // { key: 'userCode', label: 'Código', sortable: true },
        { key: 'taxId', label: 'CUIT', sortable: true },
        // { key: 'taxType', label: 'CondiciónIVA' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'address', label: 'Dirección' },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'province', label: 'Provincia' },
        { key: 'actions', label: 'Acciones' }
      ],
      allSelected: false,
      checkedItems: [],
      tableValues: [],
      deleteId: -1,
      deleteMultiple: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      filter: null
    }
  },
  computed: {
    ...mapGetters([ 'providersCount', 'isLoading', 'providers' ])
  },
  mounted () {
    this.fetchProviders()
  },
  watch: {
    checkedItems (a, b) {
      this.allSelected = (this.tableValues.length === a.length)
    }
  },
  methods: {
    fetchProviders () {
      this.$store.dispatch(FETCH_PROVIDERS)
    },
    importProviders () {
      this.$store.dispatch(IMPORT_PROVIDERS)
    },
    showDeleteModal (id) {
      if (id) {
        this.clearSelected()
        this.deleteId = id
        this.deleteMultiple = false
        this.$refs.deleteModal.$refs.confirmationModal.show()
      } else if (this.checkedItems.length > 0) {
        // si no hay id y no hay checkboxes seleccionados, ni muestro el modal
        this.deleteMultiple = true
        this.$refs.deleteModal.$refs.confirmationModal.show()
      } else {
        this.$toasted.global.error_toast({ message: 'No hay filas seleccionadas' })
      }
    },
    hideDeleteModal () {
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    confirmDelete () {
      let promises = []
      if (this.deleteMultiple) {
        for (let i = 0, len = this.checkedItems.length; i < len; i++) {
          promises.push(
            this.$store.dispatch(PROVIDER_DELETE, this.checkedItems[i].objectId)
          )
        }
        Promise.all(promises).then(() => {
          this.$toasted.global.success_toast({ message: `${this.checkedItems.length} registros eliminados con éxito` })
          this.fetchProviders()
          this.clearSelected()
        }, error => {
          this.$toasted.global.error_toast({ message: error })
        })
      } else {
        this.$store
          .dispatch(PROVIDER_DELETE, this.deleteId)
          .then(res => {
            this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
            this.fetchProviders()
            this.clearSelected()
          }, error => {
            this.$toasted.global.error_toast({ message: error })
          })
      }
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    toggleSelected () {
      this.allSelected = !this.allSelected
      this.checkedItems = this.allSelected ? this.tableValues : []
    },
    clearSelected () {
      this.allSelected = false
      this.checkedItems = []
    }
  }
}
</script>
