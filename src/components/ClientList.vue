<template>
  <div>
    <b-row class="actions-bar">
      <b-col sm="6">
        <b-button variant="primary" :to="{ name: 'Nuevo Cliente' }"><i class="fa fa-plus-circle ml-1"></i> Nuevo cliente</b-button>
        <!-- <b-button variant="outline-danger" @click="showDeleteModal()" v-b-modal.modal-center>Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
        <b-button variant="outline-primary" @click="showImportModal()"><i v-if="!clientLoading" class="fa fa-file ml-1"></i><i v-else class="fa fa-cog fa-spin ml-1"></i> Importar</b-button>
      </b-col>
    </b-row>

  <b-card :header="caption">
    <template>
      <b-row class="actions-bar">
        <b-col sm="8">
          <b-dropdown class="mx-1" variant="danger" text="Acciones en lote">
            <b-dropdown-item @click="showDeleteModal()" v-b-modal.modal-center>Eliminar seleccionados</b-dropdown-item>
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
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues" @head-clicked="clearSelected">

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
        hide-goto-end-buttons @click.native="clearSelected" />
    </nav>
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
    <c-confirmation-modal classModal="import-modal" modalTitle="Importar clientes" :promptMessage="'¿Desea importar ' + (syncClientsCount && syncClientsCount > 1 ? `${syncClientsCount} registros` : 'un registro') + '?'"
      ref="importModal" title="Confirmar importación"
      :confirmationMessage="'Sí, deseo importarlo' + (syncClientsCount && syncClientsCount > 1 ? 's' : '')"
      confirmationMethod="confirmImport" cancellationMethod="cancelImport"
      @confirmImport="confirmImport" @cancelImport="hideImportModal" />
  </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CLIENTS, FETCH_SYNC_CLIENTS, CLIENT_DELETE } from '@/store/types/actions'
import { ClientsService } from '@/api'
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
      filter: null
    }
  },
  computed: {
    ...mapGetters([ 'clientsCount', 'clientLoading', 'clients', 'syncClients', 'syncClientsCount' ])
  },
  mounted () {
    this.fetchClients()
  },
  watch: {
    checkedItems (a, b) {
      this.allSelected = (this.tableValues.length === a.length)
    }
  },
  methods: {
    fetchClients () {
      this.$store.dispatch(FETCH_CLIENTS)
    },
    showImportModal () {
      this.$store.dispatch(FETCH_SYNC_CLIENTS).then(() => {
        if (this.syncClientsCount && this.syncClientsCount > 0) {
          this.$refs.importModal.$refs.confirmationModal.show()
        } else {
          this.$toasted.global.error_toast({ message: 'No hay nuevos registros para importar' })
        }
      })
    },
    hideImportModal () {
      this.$refs.importModal.$refs.confirmationModal.hide()
    },
    confirmImport () {
      let promises = []
      for (const client of this.syncClients) {
        let clientData = {
          address: {
            streetAddress: '',
            city: '',
            postalCode: '',
            state: '',
            province: null,
            country: null
          }
        }
        // le defino una tabla vacía de precios de costo
        // porque el componente costsTable asume que existe
        clientData.costsTable = []
        clientData.addresses = []

        let addressProperties = [ 'address', 'country', 'state', 'province', 'location', 'postalCode', 'city' ]
        for (let property in client) {
          if (addressProperties.find((prop) => { return prop === property })) {
            if (property === 'address') clientData.address['streetAddress'] = client[property]
            if (property === 'location') clientData.address['city'] = client[property]
            else clientData.address[property] = client[property]
          } else {
            clientData[property] = client[property]
          }
        }
        promises.push(ClientsService.create(clientData))
      }
      Promise.all(promises).then(() => {
        this.$toasted.global.success_toast({ message: `${this.syncClientsCount} registros importados con éxito` })
        this.fetchClients()
      }, error => {
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
      this.checkedItems = this.allSelected ? this.tableValues : []
    },
    clearSelected () {
      this.allSelected = false
      this.checkedItems = []
    }
  }
}
</script>
