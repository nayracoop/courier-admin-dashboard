<template>
  <div>
    <b-row class="actions-bar">
      <b-col sm="12">
        <b-button variant="primary" :to="{ name: 'Nuevo Envío' }"><i class="fa fa-plus-circle ml-1"></i> Nuevo envío</b-button>
      </b-col>
    </b-row>
    <b-card :header="caption" v-if="shippings.length === 0">
      No hay envíos para mostrar. Crear un <b-link :to="{ name: 'Nuevo Envío' }">nuevo envío</b-link>.
    </b-card>
    <b-card :header="caption" v-else>
      <template>
        <b-row class="actions-bar">
          <b-col sm="8">
            <!-- <b-button variant="primary" :to="{ name: 'Nuevo Envío' }">Nuevo envío <i class="fa fa-plus-circle ml-1"></i></b-button> -->
            <b-dropdown class="mx-1" variant="danger" text="Acciones en lote">
              <b-dropdown-item @click="showDeleteModal()" v-b-modal.modal-center>Eliminar seleccionados</b-dropdown-item>
            </b-dropdown>
            <!-- <b-button variant="outline-danger" @click="showDeleteModal()" v-b-modal.modal-center>Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
          </b-col>
          <!-- <b-form-group class="ml-auto col-4"> -->
          <b-col sm="4">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Buscar..." />
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <!-- </b-form-group> -->
        </b-row>
      </template>
      <!-- tabla -->
      <b-table :hover="true" :striped="true" :bordered="true" :fixed="true" :items="shippingsList" :fields="fields"
        :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues" @head-clicked="clearSelected">

        <template slot="HEAD_selection" slot-scope="head">
          <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
        </template>

        <template slot="selection" slot-scope="data">
          <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
        </template>

        <template slot="actions" slot-scope="data">
          <b-button variant="primary" size="sm" :to="{ name: 'Editar Envío', params: { id: data.item.objectId } }">
            <i class="fa fa-pencil"></i> Editar
          </b-button>
          <!-- <b-button v-b-tooltip.hover title="Eliminar registro" class="btn-danger" size="sm" @click="showDeleteModal(data.item.objectId)">
            <i class="fa fa-trash"></i>
          </b-button> -->
        </template>
      </b-table>
      <!-- end tabla -->
      <nav>
        <b-pagination :total-rows="shippingsCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
          hide-goto-end-buttons @click.native="clearSelected" />
      </nav>
      <c-confirmation-modal classModal="delete-modal" :promptMessage="'¿Desea eliminar definitivamente ' + (deleteMultiple && checkedItems.length > 1 ? `los ${checkedItems.length} registros seleccionados` : 'el registro seleccionado') + '?'"
        ref="deleteModal" modalTitle="Eliminar registro"
        :confirmationMessage="'Sí, deseo eliminarlo' + (deleteMultiple && checkedItems.length > 1 ? 's' : '')"
        confirmationMethod="confirmDelete" cancellationMethod="cancelDelete"
        @confirmDelete="confirmDelete" @cancelDelete="hideDeleteModal" />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_SHIPPINGS, FETCH_CLIENTS, FETCH_PROVIDERS, IMPORT_SHIPPINGS, SHIPPING_DELETE } from '@/store/types/actions'
import CConfirmationModal from '@/components/ConfirmationModal'
import { countries, shippingTypes, serviceTypes } from '@/store/const'

export default {
  name: 'c-shipping-list',
  components: { CConfirmationModal },
  props: { caption: { type: String, default: 'Envíos' } },
  data: () => {
    return {
      fields: [ { key: 'selection', class: 'selection' },
        // { key: 'finalDate', label: 'Fecha de cierre', sortable: true },
        { key: 'initialDate', label: 'Fecha de inicio', sortable: true },
        { key: 'client', label: 'Cliente', sortable: true },
        // { key: 'clientDocValue', label: 'CUIT / Nº doc.' },
        // { key: 'origin', label: 'País de origen', sortable: true },
        // { key: 'route', label: 'Origen / Destino', sortable: true },
        { key: 'provider', label: 'Proveedor', sortable: true },
        { key: 'shippingType', label: 'Tipo de envío', sortable: true },
        { key: 'serviceType', label: 'Servicio', sortable: true },
        { key: 'destination', label: 'País de destino', sortable: true },
        { key: 'cost', label: 'Costo final' },
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
      verque: [],
      shippingsList: [],
      countryList: []
    }
  },
  computed: {
    ...mapGetters([ 'shippingsCount', 'shippingLoading', 'shippings', 'clients', 'providers' ])
  },
  created () {
    // cargo las listas de país
    countries.map(el => {
      this.countryList.push({ code: el.numericCode, name: el.name })
    })
  },
  mounted () {
    Promise.all([ this.fetchShippings(), this.fetchClients(), this.fetchProviders() ]).then(values => {
      this.shippingsList = this.shippings.map(shipping => {
        let provider = this.providers.find(element => element.objectId === shipping.providerId)
        let clients = this.clients.find(element => element.objectId === shipping.clientId)

        return {
          objectId: shipping.objectId,
          initialDate: shipping.initialDate,
          // finalDate: shipping.finalDate,
          client: (clients !== undefined) ? clients.name : '',
          provider: (provider !== undefined) ? provider.name : '',
          clientDocValue: (clients !== undefined) ? clients.docValue : '',
          origin: this.countryList.find(element => element.code === shipping.origin.country).name,
          destination: this.countryList.find(element => element.code === shipping.destination.country).name,
          // route: this.countryList.find(element => element.code === shipping.origin.country).name + ' -> ' + this.countryList.find(element => element.code === shipping.destination.country).name,
          shippingType: shippingTypes.find(element => element.value === shipping.shippingType).text,
          serviceType: serviceTypes.find(element => element.value === shipping.serviceType).text,
          cost: (shipping.pricing.cost !== undefined) ? '$' + shipping.pricing.cost : 'Sin precio',
          selection: false
        }
      })
    })
  },
  watch: {
    checkedItems (a, b) {
      this.allSelected = (this.tableValues.length === a.length)
    }
  },
  methods: {
    fetchShippings () {
      return this.$store.dispatch(FETCH_SHIPPINGS)
    },
    fetchClients () {
      return this.$store.dispatch(FETCH_CLIENTS)
    },
    fetchProviders () {
      return this.$store.dispatch(FETCH_PROVIDERS)
    },
    importShippings () {
      this.$store.dispatch(IMPORT_SHIPPINGS)
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
            this.$store.dispatch(SHIPPING_DELETE, this.checkedItems[i].objectId)
          )
        }
        Promise.all(promises).then(() => {
          this.$toasted.global.success_toast({ message: `${this.checkedItems.length} registros eliminados con éxito` })
          this.fetchShippings()
          this.clearSelected()
        }, error => {
          this.$toasted.global.error_toast({ message: error })
        })
      } else {
        this.$store
          .dispatch(SHIPPING_DELETE, this.deleteId)
          .then(res => {
            this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
            this.fetchShippings()
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
