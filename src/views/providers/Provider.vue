<template>
  <div class="animated fadeIn">
    <b-form @submit.prevent="saveProvider(provider)" enctype="multipart/form-data">
      <b-row class="actions-bar" v-if="isEdit && provider.isShipping">
        <b-col sm="12" v-if="isEdit && provider.isShipping">
          <b-button variant="primary" :to="{ name: 'Nuevo Envío', params: { providerId: provider.objectId } }"><i class="fa fa-plane ml-1"></i> Confeccionar envío</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-card no-body>
            <b-tabs card>
              <b-tab v-bind:title="isEdit ? provider.name : 'Nuevo proveedor'" active>
                <div slot="header">
                  <strong>{{ isEdit ? provider.name : 'Nuevo proveedor' }}</strong>
                </div>
                <c-provider-detail ref="providerDetail" :isEdit="isEdit"></c-provider-detail>
              </b-tab>
              <b-tab title="Zonas" v-if="provider.isShipping">
                <b-row class="actions-bar">
                  <b-col sm="8">
                    <b-button variant="outline-primary" v-b-modal.fileDialogZones><i class="fa fa-file ml-1"></i> Importar</b-button>
                    <!-- <b-button variant="outline-primary" disabled>Imprimir zonas por país<i class="fa fa-print ml-1"></i></b-button> -->
                    <b-modal id="fileDialogZones" ref="fileDialogModalZones" hide-footer centered title="Importar zonas por país" class="import-modal">
                      <c-csv-file-dialog
                        target="shippingZones"
                        bodyMessage="Elija un archivo para importar zonas por país. Únicamente se permiten archivos .csv"
                        cancellationMessage="Cancelar"
                        cancellationMethod="cancelImport"
                        @cancelImport="hideImportModals" />
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
                <c-zones-table ref="zonesTable" :filter="filter" variant="provider"></c-zones-table>
              </b-tab>
              <b-tab title="Precios de venta" v-if="provider.isShipping">
                <b-row class="actions-bar">
                  <b-col sm="8">
                    <b-button variant="outline-primary" v-b-modal.fileDialogCosts><i class="fa fa-file ml-1"></i> Importar</b-button>
                    <b-button variant="outline-primary" @click="exportPricing"><i class="fa fa-print ml-1"></i> Exportar</b-button>
                    <b-modal id="fileDialogCosts" ref="fileDialogModalCosts" hide-footer centered title="Importar precios de venta" class="import-modal">
                      <c-csv-file-dialog
                        bodyMessage="Elija un archivo para importar los precios de venta. Únicamente se permiten archivos .csv"
                        cancellationMessage="Cancelar"
                        cancellationMethod="cancelImport"
                        @cancelImport="hideImportModals" />
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
                <c-cost-table ref="costTable" :filter="filter" variant="provider"></c-cost-table>
              </b-tab>
              <b-tab title="Costo de combustible" v-if="provider.isShipping"><b-row class="actions-bar">
                  <b-form-group class="ml-auto col-4">
                    <b-input-group>
                      <b-form-input v-model="filter" placeholder="Buscar..." />
                      <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-row>
                <c-fuel-table :filter="filter" variant="provider"></c-fuel-table>
              </b-tab>
              <b-tab title="Seguro" v-if="provider.isShipping">
                <p>Costo de seguro</p>
                <div class="form-inline">
                  <b-input-group>
                    <b-form-input  type="text" v-model="provider.insurance" />
                    <b-input-group-append><b-input-group-text>%</b-input-group-text></b-input-group-append>
                    <!-- <b-input-group-append><b-input-group-text><b-check :id="id + '_defaultAddress'" v-model="value.isDefault" @change="changeDefault">Dirección por defecto</b-check></b-input-group-text></b-input-group-append> -->
                  </b-input-group>

                </div>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
        <b-col class="actions-bar" sm="12">
          <b-button v-if="isEdit" variant="primary" :disabled="inProgress" type="submit">Guardar cambios</b-button><b-button v-else variant="primary" :disabled="inProgress" type="submit">Añadir proveedor</b-button> o <b-link :to="{ path: '/proveedores' }">Cancelar</b-link>

          <!-- <b-button variant="primary" :disabled="inProgress" @click="saveProvider(provider)">Guardar <i class="fa fa-floppy-o ml-1"></i></b-button>
          <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(provider.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
          <b-button variant="outline-primary" @click="goNavigate('/proveedores', provider)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button> -->
        </b-col>
      </b-row>
    </b-form>
    <c-confirmation-modal
      classModal="delete-modal"
      ref="deleteModal"
      :modalTitle="'¿Está seguro que desea eliminar ' + provider.name + '?'"
      :promptMessage="'Se eliminará el registro de la lista de proveedores. Esta acción no se puede deshacer.'"
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
      @confirmReturn="confirmReturn(returnTo, provider)"
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
import CZonesTable from '@/components/ZonesTable'
import CFuelTable from '@/components/FuelTable'
import CConfirmationModal from '@/components/ConfirmationModal'
import CProviderDetail from '@/components/ProviderDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: { CCostTable, CConfirmationModal, CProviderDetail, CCsvFileDialog, CZonesTable, CFuelTable },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
  mounted () {
    this.cleanObject = this._.cloneDeep(this.provider)
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(PROVIDER_RESET_STATE)
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.provider)
    })
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.provider)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.provider) || this.returnConfirmed) {
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
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones
    }
  },
  computed: {
    ...mapGetters(['provider']),
    isEdit () {
      return !!this.provider.objectId
    }
  },
  methods: {
    saveProvider (provider) {
      provider.fuelTable.forEach(item => {
        delete item.edit
      })
      provider.costsTable.forEach(cost => {
        cost.costs.forEach(item => {
          delete item.edit
        })
      })
      this.$refs.providerDetail.validateBeforeSubmit().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Por favor, corríjalos y vuelva a guardar' })
          return false
        }
        this.save(provider, this.isEdit ? PROVIDER_EDIT : PROVIDER_SAVE, 'Editar Proveedor')
      })
    },
    deleteProvider () {
      this.deleteEl(PROVIDER_DELETE, '/proveedores')
    },
    hideImportModals () {
      this.$refs.fileDialogModalZones.hide()
      this.$refs.fileDialogModalCosts.hide()

      this.$refs.costTable.refresh()
      this.$refs.zonesTable.refresh()
    },
    exportPricing () {
      let result = '"envio","servicio","embalaje","peso","Zona 1","Zona 2","Zona 3","Zona 4","Zona 5","Zona 6","Descuento Zona 1","Descuento Zona 2","Descuento Zona 3","Descuento Zona 4","Descuento Zona 5","Descuento Zona 6"'
      let registers = {}
      let fileLink = document.createElement('a')
      for (const item of this.provider.costsTable) {
        const shippingType = this.shippingTypes.find(el => el.value === item.shippingType)
        const serviceType = this.serviceTypes.find(el => el.value === item.serviceType)
        const packageType = this.packageTypes.find(el => el.value === item.packageType)
        const shippingZone = this.shippingZones.find(el => el.value === item.shippingZone)

        if (shippingType && serviceType && packageType && shippingZone) {
          let keyBase = '"' + shippingType.text + '","' + serviceType.text + '","' + packageType.text + '","'
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
      fileLink.setAttribute('download', this.provider.name + '.csv')
      fileLink.click()
    }
  }
}
</script>
