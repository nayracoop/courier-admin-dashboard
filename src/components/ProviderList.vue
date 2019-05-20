<template>
  <div>
    <b-row class="actions-bar">
      <b-col sm="12">
        <b-button variant="primary" :to="{ name: 'Nuevo Proveedor' }"><i class="fa fa-plus-circle ml-1"></i> Nuevo proveedor</b-button>
        <b-button variant="outline-primary" @click="showImportModal()"><i v-if="!providerLoading" class="fa fa-file ml-1"></i><i v-else class="fa fa-cog fa-spin ml-1"></i> Importar </b-button>
      </b-col>
    </b-row>
    <b-card :header="caption" v-if="providers.length === 0">
      No hay proveedores cargados. Crear un <b-link :to="{ name: 'Nuevo Proveedor' }">nuevo proveedor</b-link>.
    </b-card>
    <b-card :header="caption" v-else>
      <template>
        <b-row class="actions-bar">
          <b-col sm="8">
            <b-dropdown class="mx-1" variant="danger" text="Acciones en lote">
              <b-dropdown-item @click="downloadSelectedData()" v-b-modal.modal-center><i class="fa fa-file-excel-o" aria-hidden="true"></i>Descargar tabla ({{ checkedItems.length }} items)</b-dropdown-item>
              <b-dropdown-item @click="clearSelected()" v-b-modal.modal-center><i class="fa fa-times" aria-hidden="true"></i>Deseleccionar todo ({{ checkedItems.length }} items)</b-dropdown-item>
              <b-dropdown-item @click="showDeleteModal()" v-b-modal.modal-center><i class="fa fa-trash" aria-hidden="true"></i>Eliminar seleccionados ({{ checkedItems.length }} items)</b-dropdown-item>
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
      <b-table class="list-table" :hover="true" :striped="true" :bordered="true" :small="false" :fixed="true" :items="providers" :fields="fields"
        :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues">

        <template slot="HEAD_selection" slot-scope="head">
          <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
        </template>

        <template slot="selection" slot-scope="data">
          <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
        </template>
        <template slot="name" slot-scope="data">
          <b-button variant="link" :to="{ name: 'Editar Proveedor', params: { id: data.item.objectId } }">
            {{ data.item.name }}
          </b-button>
        </template>

        <template slot="actions" slot-scope="data">
          <b-button variant="primary" size="sm" :to="{ name: 'Editar Proveedor', params: { id: data.item.objectId } }">
            <i class="fa fa-pencil"></i> Editar
          </b-button>
          <b-button size="sm" :to="{ name: 'Nuevo Envío', params: { providerId: data.item.objectId } }" v-if="data.item.isShipping">
            <i class="fa fa-plane"></i> Nuevo envío
          </b-button>
          <!-- <b-button v-b-tooltip.hover title="Eliminar registro" class="btn-danger" :small="true" @click="showDeleteModal(data.item.objectId)">
            <i class="fa fa-trash"></i>
          </b-button> -->
        </template>
      </b-table>
      <!-- end tabla -->
      <nav>
        <b-pagination :total-rows="providersCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
          hide-goto-end-buttons />
      </nav>
    </b-card>
    <c-confirmation-modal
    classModal="delete-modal"
    ref="deleteModal"
    :modalTitle="'¿Está seguro que desea eliminar ' +  (deleteMultiple && checkedItems.length > 1 ? 'los registros seleccionados' : 'este registro') + '?'"
    :promptMessage="'Se ' + (deleteMultiple && checkedItems.length > 1 ? `eliminarán los ${checkedItems.length} registros seleccionados` : 'eliminará el registro seleccionado') + ' de la lista de proveedores. Esta acción no se puede deshacer'"
    :confirmationMessage="'Sí, ' + (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' eliminaré'"
    :cancellationMessage="'No, ' +  (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' conservaré '  "
    confirmationMethod="confirmDelete"
    cancellationMethod="cancelDelete"
    @confirmDelete="confirmDelete"
    @cancelDelete="hideDeleteModal" />
    <c-confirmation-modal
    classModal="import-modal"  modalTitle="Importar proveedores"
    ref="importModal"  defaultStyles="true" variantConfirmation="primary"
    :promptMessage="'¿Desea importar ' + (syncProvidersCount && syncProvidersCount > 1 ? `${syncProvidersCount} registros` : 'un registro') + '?'"
    title="Confirmar importación"
    :confirmationMessage="'Sí, deseo importarlo' + (syncProvidersCount && syncProvidersCount > 1 ? 's' : '')"
    confirmationMethod="confirmImport"
    cancellationMethod="cancelImport"
    @confirmImport="confirmImport"
    @cancelImport="hideImportModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_PROVIDERS, FETCH_SYNC_PROVIDERS, PROVIDER_DELETE } from '@/store/types/actions'
import { ProvidersService } from '@/api'
import CConfirmationModal from '@/components/ConfirmationModal'

export default {
  name: 'c-provider-list',
  components: { CConfirmationModal },
  props: { caption: { type: String, default: 'Proveedores' }, clase: {type: String} },
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
      filter: null
    }
  },
  computed: {
    ...mapGetters([ 'providersCount', 'providerLoading', 'providers', 'syncProviders', 'syncProvidersCount' ])
  },
  mounted () {
    this.fetchProviders()
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
    fetchProviders () {
      this.$store.dispatch(FETCH_PROVIDERS)
    },
    showImportModal () {
      this.$store.dispatch(FETCH_SYNC_PROVIDERS).then(() => {
        if (this.syncProvidersCount && this.syncProvidersCount > 0) {
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
      for (const provider of this.syncProviders) {
        let providerData = {
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
        providerData.costsTable = []
        providerData.shippingZones = []
        providerData.fuelTable = []

        let addressProperties = [ 'address', 'country', 'state', 'province', 'location', 'postalCode', 'city' ]
        for (let property in provider) {
          if (addressProperties.find((prop) => { return prop === property })) {
            if (property === 'address') providerData.address['streetAddress'] = provider[property]
            if (property === 'location') providerData.address['city'] = provider[property]
            else providerData.address[property] = provider[property]
          } else {
            providerData[property] = provider[property]
          }
        }
        promises.push(ProvidersService.create(providerData))
        // promises.push(ProvidersService.create(provider))
      }
      Promise.all(promises).then(() => {
        this.$toasted.global.success_toast({ message: `${this.syncProvidersCount} registros importados con éxito` })
        this.fetchProviders()
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
      fileLink.setAttribute('download', 'proveedores.csv')
      fileLink.click()
    }
  }
}
</script>
