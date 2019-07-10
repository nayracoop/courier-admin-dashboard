<template>
  <div class="animated fadeIn">
    <b-form @submit.prevent="saveClient(client)">
      <b-row>
        <b-col sm="12">
          <b-card no-body>
            <b-tabs card>
              <b-tab v-bind:title="isEdit ? client.name : 'Datos personales'" active>
                <div slot="header">
                  <strong>{{ isEdit ? client.name : 'Datos personales' }}</strong>
                </div>
                <c-client-detail ref="clientDetail" :isEdit="isEdit"></c-client-detail>
                <!-- <div role="tablist" class="mb-3">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-btn block href="#" v-b-toggle.accordion1>Direcciones</b-btn>
                    </b-card-header>
                    <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
                      <b-card-body>
                        <c-addresses />
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div> -->
              </b-tab>
              <b-tab title="Direcciones">
                <c-addresses></c-addresses>
                <!-- <div role="tablist" class="mb-3">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-btn block href="#" v-b-toggle.accordion1>Direcciones</b-btn>
                    </b-card-header>
                  </b-card>
                </div> -->
              </b-tab>
              <b-tab title="Descuentos">
                <b-row class="actions-bar">
                  <b-col sm="8">
                    <b-button variant="outline-primary" v-b-modal.fileDialog><i class="fa fa-file ml-1"></i> Importar</b-button>
                    <b-button variant="outline-primary" @click="exportPricing" :disabled="exportButtonsDisabled"><i class="fa fa-print ml-1"></i> Exportar</b-button>
                    <b-button variant="outline-primary" @click="download" :disabled="exportButtonsDisabled"><i class="fa fa-print ml-1"></i> Descargar presupuesto</b-button>
                    <b-modal id="fileDialog" ref="fileDialogModal" hide-footer centered title="Importar lista de descuentos" class="import-modal">
                      <c-csv-file-dialog
                        bodyMessage="Elija un archivo para importar la lista de descuentos. Únicamente se permiten archivos .csv"
                        cancellationMessage="Cancelar"
                        cancellationMethod="cancelImport"
                        @cancelImport="hideImportModal()"
                        target="client" />
                    </b-modal>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <c-cost-table ref="costTable" :filter="filter" variant="client" :providerList="providerList" @filtersUpdated="filtersUpdated"></c-cost-table>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
        <b-col class="actions-bar" sm="12">
          <b-button v-if="isEdit" variant="primary" :disabled="inProgress" type="submit">Guardar cambios</b-button><b-button v-else variant="primary" :disabled="inProgress" type="submit">Añadir cliente</b-button> o <b-link :to="{ path: '/clientes' }">Cancelar</b-link>
          <!-- <b-button variant="primary" :disabled="inProgress" @click="saveClient(client)">Guardar <i class="fa fa-save ml-1"></i></b-button> -->
          <!-- <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(client.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
          <!-- <b-button variant="outline-primary" @click="goNavigate('/clientes', client)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button> -->
        </b-col>
      </b-row>
    </b-form>
    <c-confirmation-modal
      classModal="delete-modal"
      ref="deleteModal"
      :modalTitle="'¿Está seguro que desea eliminar ' + client.name + '?'"
      :promptMessage="'Se eliminará el registro de la lista de clientes. Esta acción no se puede deshacer.'"
      confirmationMessage="Sí, lo eliminaré"
      cancellationMessage="No, lo conservaré"
      confirmationMethod="confirmDelete"
      cancellationMethod="cancelDelete"
      @confirmDelete="deleteClient()"
      @cancelDelete="hideDeleteModal()" />
    <c-confirmation-modal
      classModal="return-modal"
      ref="returnModal"
      modalTitle="¿Desea descartar los cambios?"
      promptMessage="Hay cambios sin guardar en este registro. Si sale de esta pantalla se perderán. Esta acción no se puede deshacer."
      variantConfirmation="warning"
      confirmationMessage="Sí, descartar cambios"
      cancellationMessage="No, seguir editando"
      confirmationMethod="confirmReturn"
      cancellationMethod="cancelReturn"
      @confirmReturn="confirmReturn(returnTo, client)"
      @cancelReturn="hideReturnModal()" />
  </div>
</template>

<script>
import { shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import { mapGetters } from 'vuex'
import store from '@/store'

import { modalMixin } from '@/mixins/modalMixin'
import { navigationMixin } from '@/mixins/navigationMixin'
import { crudMixin } from '@/mixins/crudMixin'

import CCostTable from '@/components/CostTable'
import CConfirmationModal from '@/components/ConfirmationModal'
import CAddresses from '@/components/Addresses'
import CClientDetail from '@/components/ClientDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, FETCH_CLIENT, CLIENT_RESET_STATE, PROVIDER_RESET_STATE, FETCH_SHIPPING_PROVIDERS } from '@/store/types/actions'

export default {
  name: 'v-client',
  components: { CCostTable, CConfirmationModal, CAddresses, CClientDetail, CCsvFileDialog },
  props: {
    previousClient: {
      type: Object,
      required: false
    }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
  created () {
    this.cleanObject = this._.cloneDeep(this.client)

    this.fetchProviders().then(() => {
      this.providerList = this.providers.map(provider => {
        return ({ value: provider.objectId, text: provider.name })
      })
    })
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(CLIENT_RESET_STATE)
    await store.dispatch(PROVIDER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(CLIENT_RESET_STATE)
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_CLIENT,
        to.params.id,
        to.params.previousClient
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.client)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.client) || this.returnConfirmed) {
      await store.dispatch(CLIENT_RESET_STATE)
      await store.dispatch(PROVIDER_RESET_STATE)
      next()
    } else {
      this.showReturnModal(to.path)
      next(false)
    }
  },
  data () {
    return {
      inProgress: false,
      cleanObject: null,
      deleteId: -1,
      returnConfirmed: false,
      returnTo: null,
      filter: null,
      providerList: [],
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones,
      exportButtonsDisabled: true
    }
  },
  computed: {
    ...mapGetters(['client', 'providers']),
    isEdit () {
      return !!this.client.objectId
    }
  },
  methods: {
    fetchProviders () {
      return this.$store.dispatch(FETCH_SHIPPING_PROVIDERS)
    },
    saveClient (client) {
      // provider.fuelTable.forEach(item => {
      //   delete item.edit
      // })
      // provider.costsTable.forEach(cost => {
      //   cost.costs.forEach(item => {
      //     delete item.edit
      //   })
      // })
      this.$refs.clientDetail.validateBeforeSubmit().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Por favor, corríjalos y vuelva a guardar' })
          return false
        }
        this.save(client, this.isEdit ? CLIENT_EDIT : CLIENT_SAVE, 'Editar Cliente')
      })
    },
    filtersUpdated () {
      this.exportButtonsDisabled = this.$refs.costTable === undefined || this.$refs.costTable.costsFilter.providerId === undefined || this.$refs.costTable.costsFilter.providerId === -1
    },
    deleteClient () {
      this.deleteEl(CLIENT_DELETE, '/clientes')
    },
    hideImportModal () {
      this.$refs.fileDialogModal.hide()
      this.$refs.costTable.refresh()
    },
    exportPricing () {
      let result = '"proveedor","envio","servicio","embalaje","peso","Zona 1","Zona 2","Zona 3","Zona 4","Zona 5","Zona 6","Descuento Zona 1","Descuento Zona 2","Descuento Zona 3","Descuento Zona 4","Descuento Zona 5","Descuento Zona 6"'
      let registers = {}
      let fileLink = document.createElement('a')
      
      // this.$refs.costTable.$el.focus()
      // this.$refs.costTable.$el.print()
      if (this.$refs.costTable.costsFilter.providerId === undefined || this.$refs.costTable.costsFilter.providerId === -1) return
      let provider = this.providers.find(el => el.objectId === this.$refs.costTable.costsFilter.providerId)
      if (provider !== undefined  && provider.costsTable !== undefined) {
        for (const item of provider.costsTable) {
          const shippingType = this.shippingTypes.find(el => el.value === item.shippingType)
          const serviceType = this.serviceTypes.find(el => el.value === item.serviceType)
          const packageType = this.packageTypes.find(el => el.value === item.packageType)
          const shippingZone = this.shippingZones.find(el => el.value === item.shippingZone)

          if (shippingType && serviceType && packageType && shippingZone) {
            let keyBase = '"' + provider.objectId + '","' + shippingType.text + '","' + serviceType.text + '","' + packageType.text + '","'
            for (const cost of item.costs) {
              let key = keyBase + cost.weight + '","'
              if (registers[key] === undefined) {
                registers[key] = {}
              }
              registers[key]['Zona ' + shippingZone.text] = cost.grossPrice
              registers[key]['Descuento Zona ' + shippingZone.text] = cost.costDiscount
            }
          }
        }

        for (const key in registers) {
          result += '\n' + key
          result += (registers[key]['Zona 1'] !== undefined) ? registers[key]['Zona 1'] + '","' : '","'
          result += (registers[key]['Zona 2'] !== undefined) ? registers[key]['Zona 2'] + '","' : '","'
          result += (registers[key]['Zona 3'] !== undefined) ? registers[key]['Zona 3'] + '","' : '","'
          result += (registers[key]['Zona 4'] !== undefined) ? registers[key]['Zona 4'] + '","' : '","'
          result += (registers[key]['Zona 5'] !== undefined) ? registers[key]['Zona 5'] + '","' : '","'
          result += (registers[key]['Zona 6'] !== undefined) ? registers[key]['Zona 6'] + '","' : '","'
          result += (registers[key]['Descuento Zona 1'] !== undefined) ? registers[key]['Descuento Zona 1'] + '","' : '","'
          result += (registers[key]['Descuento Zona 2'] !== undefined) ? registers[key]['Descuento Zona 2'] + '","' : '","'
          result += (registers[key]['Descuento Zona 3'] !== undefined) ? registers[key]['Descuento Zona 3'] + '","' : '","'
          result += (registers[key]['Descuento Zona 4'] !== undefined) ? registers[key]['Descuento Zona 4'] + '","' : '","'
          result += (registers[key]['Descuento Zona 5'] !== undefined) ? registers[key]['Descuento Zona 5'] + '","' : '","'
          result += (registers[key]['Descuento Zona 6'] !== undefined) ? registers[key]['Descuento Zona 6'] + '"' : '"'
        }

        fileLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result))
        fileLink.setAttribute('download', this.client.name + '.csv')
        fileLink.click()
      }
    },
    download () {
      const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
      const provider = this.providers.find(el => el.objectId === this.$refs.costTable.costsFilter.providerId)
      const shippingType = this.shippingTypes.find(el => el.value === this.$refs.costTable.costsFilter.shippingType)
      const serviceType = this.serviceTypes.find(el => el.value === this.$refs.costTable.costsFilter.serviceType)
      const packageType = this.packageTypes.find(el => el.value === this.$refs.costTable.costsFilter.packageType)
      const shippingZone = this.shippingZones.find(el => el.value === this.$refs.costTable.costsFilter.shippingZone)

      let currentDate = new Date()
      let formattedDate = currentDate.getDate() + " de " + months[currentDate.getMonth()] + " de " + currentDate.getFullYear()
      let fileLink = document.createElement('a')

      

      if (provider !== undefined  && provider.costsTable !== undefined) {

        let rows = {}
        let rowsHTML = ''
        for (const item of provider.costsTable) {
          if (shippingType.value === item.shippingType && serviceType.value === item.serviceType && packageType.value === item.packageType && shippingZone.value === item.shippingZone) {
            for (const cost of item.costs) {
              rows[cost.weight] = { 'grossPrice': cost.grossPrice, 'discount': 0 }
            }
          }
        }

        for (const item of this.client.costsTable) {
          if (provider.objectId === item.providerId && shippingType.value === item.shippingType && serviceType.value === item.serviceType && packageType.value === item.packageType && shippingZone.value === item.shippingZone) {
            for (const cost of item.costs) {
              if(rows[cost.weight] !== undefined) {
                rows[cost.weight].discount = cost.saleDiscount
              }
            }
          }
        }

        for (const key in rows) {
          
          rowsHTML += `<tr>
            <td>${key} kg</td>
            <td>$${rows[key].grossPrice}</td>
            <td>${rows[key].discount}%</td>
            <td>$${rows[key].grossPrice*(1-rows[key].discount/100)}</td>
          </tr>`
        }

        let result = `<h1>American Courier</h1>
        <p>
          <b>Para</b>: ${this.client.name}<br />
          ${formattedDate}
        </p>
        <p>
          <b>Proveedor</b>: ${provider.businessName || provider.name}<br />
          <b>Tipo de envío</b>: ${shippingType.text}<br />
          <b>Servicio</b>: ${serviceType.text}<br />
          <b>Tipo de embalaje</b>: ${packageType.text}<br />
          <b>Zona</b>: ${shippingZone.text}<br />
        </p>
        <table width="100%">
          <thead>
            <tr>
              <th>Peso</th>
              <th>Precio bruto</th>
              <th>Descuento</th>
              <th>Neto</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>`

        fileLink.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(result))
        fileLink.setAttribute('download', this.client.name + '.docx')
        fileLink.click()
      }
    }
  }
}
</script>
