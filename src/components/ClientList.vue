<template>
  <div>
    <b-row class="actions-bar">
      <b-col sm="6">
        <b-button variant="primary" :to="{ name: 'Nuevo Cliente' }"><i class="fa fa-plus-circle ml-1"></i> Nuevo cliente</b-button>
        <!-- <b-button variant="outline-danger" @click="showDeleteModal()" v-b-modal.modal-center>Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
        <b-button variant="outline-primary" @click="showImportModal()"><i v-if="!clientSynching" class="fa fa-file ml-1"></i><i v-else class="fa fa-cog fa-spin ml-1"></i> Sincronizar</b-button>
      </b-col>
    </b-row>
    <b-card :header="caption" v-if="clients.length === 0">
      No hay clientes cargados. Crear un <b-link :to="{ name: 'Nuevo Cliente' }">nuevo cliente</b-link>.
    </b-card>
  <b-card :header="caption" v-else>
    <template>
      <b-row class="actions-bar">
        <b-col sm="8">
          <b-dropdown class="mx-1" variant="danger" text="Acciones en lote">
            <b-dropdown-item @click="downloadSelectedData()" v-b-modal.modal-center><i class="fa fa-file-excel-o" aria-hidden="true"></i>Descargar tabla ({{ checkedItems.length }} items)</b-dropdown-item>
            <b-dropdown-item @click="clearSelected()" v-b-modal.modal-center><i class="fa fa-times" aria-hidden="true"></i>Deseleccionar todo ({{ checkedItems.length }} items)</b-dropdown-item>
            <!-- <b-dropdown-item @click="downloadSelectedData()" v-b-modal.modal-center><i class="fa fa-download" aria-hidden="true"></i>Exportar seleccionados ({{ checkedItems.length }})</b-dropdown-item> -->
            <b-dropdown-item @click="showDeleteModal()" v-b-modal.modal-center><i class="fa fa-trash" aria-hidden="true"></i>Eliminar seleccionados ({{ checkedItems.length }} items)</b-dropdown-item>
            <!-- <b-dropdown-item>Item 2</b-dropdown-item> -->
          </b-dropdown>
        </b-col>
        <b-col sm="4">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </template>
    <!-- tabla -->
    <b-table class="list-table" :hover="true" :striped="true" :bordered="true" :small="false" :fixed="true" :items="clients" :fields="fields"
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues">

      <template slot="HEAD_selection" slot-scope="head">
        <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
      </template>

      <template slot="selection" slot-scope="data">
        <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
      </template>
      <template slot="name" slot-scope="data">
        <b-button variant="link" :to="{ name: 'Editar Cliente', params: { id: data.item.objectId } }">
          {{ data.item.name }}
        </b-button>
      </template>

      <template slot="actions" slot-scope="data">
        <b-button variant="primary" size="sm" :to="{ name: 'Editar Cliente', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i> Editar
        </b-button>
        <b-button :small="false" size="sm" :to="{ name: 'Nuevo Envío', params: { clientId: data.item.objectId } }">
          <i class="fa fa-plane"></i> Nuevo envío
        </b-button>
        <!-- <b-button v-b-tooltip.hover title="Eliminar registro" class="btn-danger" :small="false" size="sm" @click="showDeleteModal(data.item.objectId)">
          <i class="fa fa-trash"></i> Eliminar
        </b-button> -->
      </template>
    </b-table>
    <!-- end tabla -->
    <nav>
      <b-pagination :total-rows="clientsCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
        hide-goto-end-buttons />
    </nav>
  </b-card>
  <c-confirmation-modal
  classModal="delete-modal"
  ref="deleteModal"
  :modalTitle="'¿Está seguro que desea eliminar ' +  (deleteMultiple && checkedItems.length > 1 ? 'los registros seleccionados' : 'este registro') + '?'"
  :promptMessage="'Se ' + (deleteMultiple && checkedItems.length > 1 ? `eliminarán los ${checkedItems.length} registros seleccionados` : 'eliminará el registro seleccionado') + ' de la lista de clientes. Esta acción no se puede deshacer'"
  :confirmationMessage="'Sí, ' + (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' eliminaré'"
  :cancellationMessage="'No, ' +  (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' conservaré '  "
  confirmationMethod="confirmDelete"
  cancellationMethod="cancelDelete"
  @confirmDelete="confirmDelete"
  @cancelDelete="hideDeleteModal" />
  <c-confirmation-modal classModal="import-modal" modalTitle="Sincronizar clientes" :promptMessage="syncDifferencesMessage"
    ref="importModal" title="Confirmar sincronización" variantConfirmation="primary" defaultStyles="true"
    :confirmationMessage="'Sí, deseo sincronizarlo' + (syncClientsCount && syncClientsCount > 1 ? 's' : '')"
    confirmationMethod="confirmImport" cancellationMethod="cancelImport"
    @confirmImport="confirmImport" @cancelImport="hideImportModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CLIENTS, FETCH_CLIENTS_SYNC_DIFFERENCES, CLIENTS_SYNC, CLIENT_DELETE } from '@/store/types/actions'
import CConfirmationModal from '@/components/ConfirmationModal'

export default {
  name: 'c-client-list',
  components: { CConfirmationModal },
  props: { caption: { type: String, default: 'Clientes' } },
  data: () => {
    return {
      fields: [ { key: 'selection', class: 'selection' },
        { key: 'name', label: 'Nombre', sortable: true, editable: true },
        // { key: 'userCode', label: 'Código', sortable: true },
        { key: 'docValue', label: 'CUIT / Nº doc.', sortable: true },
        // { key: 'taxCategory', label: 'CondiciónIVA' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'address.streetAddress', label: 'Dirección' },
        { key: 'email', label: 'Email', sortable: true },
        // { key: 'province', label: 'Provincia' },
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
      filter: null,
      syncDifferencesMessage: '',
      syncClientsCount: 0
    }
  },
  computed: {
    ...mapGetters([ 'clients', 'clientsCount', 'clientSynching', 'clientSyncDifferencesDetails' ])
  },
  mounted () {
    this.fetchClients()
  },
  watch: {
    checkedItems (a, b) {
      // this.allSelected = (this.tableValues.length === a.length)
      this.allSelected = this.checkedItems.filter(e => this.tableValues.find(a => e === a)).length === this.tableValues.length
    },
    tableValues () {
      this.allSelected = this.checkedItems.filter(e => this.tableValues.find(a => e === a)).length === this.tableValues.length
    }
  },
  methods: {
    fetchClients () {
      this.$store.dispatch(FETCH_CLIENTS)
    },
    showImportModal () {
      this.$store.dispatch(FETCH_CLIENTS_SYNC_DIFFERENCES)
        .then(() => {
          if (this.clientSyncDifferencesDetails && this.clientSyncDifferencesDetails.canSync) {
            this.syncClientsCount = this.clientSyncDifferencesDetails.import + this.clientSyncDifferencesDetails.export
            this.syncDifferencesMessage = `¿Desea recibir ${this.clientSyncDifferencesDetails.import} y enviar ${this.clientSyncDifferencesDetails.export} registros?`
            this.$refs.importModal.$refs.confirmationModal.show()
          } else {
            this.$toasted.global.error_toast({ message: 'No hay registros para sincronizar' })
          }
        })
        .catch((error) => {
          this.$toasted.global.error_toast({ message: error })
        })
    },
    hideImportModal () {
      this.$refs.importModal.$refs.confirmationModal.hide()
    },
    confirmImport () {
      this.$store.dispatch(CLIENTS_SYNC)
        .then((syncResults) => {
          this.$toasted.global.success_toast({ message: syncResults.message })
          this.fetchClients()
        })
        .catch((error) => {
          this.$toasted.global.error_toast({ message: error })
        })
      this.$refs.importModal.$refs.confirmationModal.hide()
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
            this.$store.dispatch(CLIENT_DELETE, this.checkedItems[i].objectId)
          )
        }
        Promise.all(promises).then(() => {
          this.$toasted.global.success_toast({ message: `${this.checkedItems.length} registros eliminados con éxito` })
          this.fetchClients()
          this.clearSelected()
        }, error => {
          this.$toasted.global.error_toast({ message: error })
        })
      } else {
        this.$store
          .dispatch(CLIENT_DELETE, this.deleteId)
          .then(res => {
            this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
            this.fetchClients()
            this.clearSelected()
          }, error => {
            this.$toasted.global.error_toast({ message: error })
          })
      }
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    toggleSelected () {
      this.allSelected = !this.allSelected
      if (this.allSelected) {
        this.checkedItems = [ ...this.checkedItems, ...this.tableValues ]
      } else {
        this.checkedItems = this.checkedItems.filter(e => !this.tableValues.find(a => e === a))
      }
      this.checkedItems = [ ...new Set(this.checkedItems) ]
    },
    clearSelected () {
      this.allSelected = false
      this.checkedItems = []
    },
    downloadSelectedData () {
      let result = '"Nombre","CUIT / Nº doc.","Teléfono","Dirección","Email"'
      let fileLink = document.createElement('a')
      for (const item of this.checkedItems) {
        if (item) {
          result += '\n"' + item.name + '","' +
          item.docValue + '","' +
          item.phone + '","' +
          item.address.streetAddress + '","' +
          item.email + '"'
        }
      }

      fileLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result))
      fileLink.setAttribute('download', 'clientes.csv')
      fileLink.click()
    }
  }
}
</script>
