<template>
  <b-form>
    <b-row>
      <b-col sm="4">
        <b-form-group>
          <label for="import">Importación</label>
          <b-row id="import">
            <b-col sm="12">
              <b-table hover bordered small fixed responsive="sm"
              :items="importItems"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              @filtered="filtered">
                <template slot="country" slot-scope="data">
                  <b-form-input readonly type="text" v-model="data.item.name"></b-form-input>
                </template>
                <template slot="zone" slot-scope="data">
                  <b-form-input :readonly="(inProgress || !data.item.edit) ? true : false" type="number" placeholder="Zona" v-model.number="data.item.zone"></b-form-input>
                </template>
                <template slot="actions" slot-scope="data">
                  <template v-if="data.item.edit">
                    <b-button variant="warning" @click.prevent="revertEdit(data.item, 1)">
                      <i class="fa fa-undo"></i>
                    </b-button>
                    <b-button variant="primary" @click.prevent="applyEdit(data.item, 1)">
                      <strong><i class="fa fa-check"></i></strong>
                    </b-button>
                  </template>
                  <template v-else>
                    <b-button variant="primary" @click.prevent="enableEdit(data.item, 1)">
                      <strong><i class="fa fa-edit"></i></strong>
                    </b-button>
                  </template>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group>
          <label for="export">Exportación</label>
          <b-row id="export">
            <b-col sm="12">
              <b-table hover bordered small fixed responsive="sm"
              :items="exportItems"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              @filtered="filtered">
                <template slot="country" slot-scope="data">
                  <b-form-input readonly type="text" v-model="data.item.name"></b-form-input>
                </template>
                <template slot="zone" slot-scope="data">
                  <b-form-input :readonly="(inProgress || !data.item.edit) ? true : false" type="number" placeholder="Zona" v-model.number="data.item.zone"></b-form-input>
                </template>
                <template slot="actions" slot-scope="data">
                  <template v-if="data.item.edit">
                    <b-button variant="warning" @click.prevent="revertEdit(data.item, 2)">
                      <i class="fa fa-undo"></i>
                    </b-button>
                    <b-button variant="primary" @click.prevent="applyEdit(data.item, 2)">
                      <strong><i class="fa fa-check"></i></strong>
                    </b-button>
                  </template>
                  <template v-else>
                    <b-button variant="primary" @click.prevent="enableEdit(data.item, 2)">
                      <strong><i class="fa fa-edit"></i></strong>
                    </b-button>
                  </template>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group>
          <label for="domestic">Doméstico</label>
          <b-row id="domestic">
            <b-col sm="12">
              <b-table hover bordered small fixed responsive="sm"
              :items="domesticItems"
              :fields="domesticFields"
              :current-page="domesticCurrentPage"
              :per-page="perPage"
              :filter="filter"
              @filtered="filtered">
                <template slot="postalCode" slot-scope="data">
                  <b-form-input readonly type="text" v-model="data.item.postalCode"></b-form-input>
                </template>
                <template slot="zone" slot-scope="data">
                  <b-form-input :readonly="(inProgress || !data.item.edit) ? true : false" type="number" placeholder="Zona" v-model.number="data.item.zone"></b-form-input>
                </template>
                <template slot="actions" slot-scope="data">
                  <template v-if="data.item.edit">
                    <b-button variant="warning" @click.prevent="revertEdit(data.item, 3)">
                      <i class="fa fa-undo"></i>
                    </b-button>
                    <b-button variant="primary" @click.prevent="applyEdit(data.item, 3)">
                      <strong><i class="fa fa-check"></i></strong>
                    </b-button>
                  </template>
                  <template v-else>
                    <b-button variant="primary" @click.prevent="enableEdit(data.item, 3)">
                      <strong><i class="fa fa-edit"></i></strong>
                    </b-button>
                  </template>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="8" class="text-center">
        <nav>
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente" :limit="8" />
        </nav>
      </b-col>
      <b-col sm="4">
         <nav>
          <b-pagination :total-rows="domesticTotalRows" :per-page="perPage" v-model="domesticCurrentPage" prev-text="Anterior" next-text="Siguiente" :limit="8" />
        </nav>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { countries } from '@/store/const'
import { mapGetters } from 'vuex'

export default {
  name: 'c-zone-table',
  props: {
    filter: { type: String },
    providerList: { type: Array }
  },
  data () {
    return {
      fields: [
        { key: 'country', label: 'País' },
        { key: 'zone', label: 'Zona' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],
      domesticFields: [
        { key: 'postalCode', label: 'Código postal' },
        { key: 'zone', label: 'Zona' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],
      // import and export countries list
      iCountriesList: this._.cloneDeep(countries),
      eCountriesList: this._.cloneDeep(countries),
      importItems: [],
      exportItems: [],
      domesticItems: [],
      inProgress: false,
      // inEdit tiene que compartirse con el parent
      // para el botón guardar
      inEdit: false,
      oldRow: {},
      // hasWeight: false,
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      domesticCurrentPage: 1,
      domesticTotalRows: 1
    }
  },

  created () {
    this.resetFilter()
  },
  methods: {
    resetFilter () {
      let providerImportZones = []
      let providerExportZones = []
      // let providerDomesticZones = []

      if (this.provider.shippingZones && this.provider.shippingZones.length) {
        // TODO: sacar el horrible hardcode?
        let searchImportZones = this.provider.shippingZones.filter(el => el.shippingType === 1)
        let searchExportZones = this.provider.shippingZones.filter(el => el.shippingType === 2)
        // let searchDomesticZones = this.provider.shippingZones.filter(el => el.shippingType === 3)

        providerImportZones = searchImportZones && searchImportZones.length && searchImportZones[0].countries
        providerExportZones = searchExportZones && searchExportZones.length && searchExportZones[0].countries
        // providerDomesticZones = searchDomesticZones && searchDomesticZones.length && searchDomesticZones[0].countries

        this.importItems = [...this.iCountriesList.concat(providerImportZones).reduce((m, o) => m.set(o.numericCode, Object.assign((m && m.get(o.numericCode)) || {}, o)), new Map()).values()]
        this.exportItems = [...this.eCountriesList.concat(providerExportZones).reduce((m, o) => m.set(o.numericCode, Object.assign((m && m.get(o.numericCode)) || {}, o)), new Map()).values()]
        // this.domesticItems = [...this.countriesList.concat(providerDomesticZones).reduce((m, o) => m.set(o.numericCode, Object.assign((m && m.get(o.numericCode)) || {}, o)), new Map()).values()]
      } else {
        // no quiero una referencia
        this.importItems = this._.cloneDeep(this.iCountriesList, true)
        this.exportItems = this._.cloneDeep(this.eCountriesList, true)
      }

      // todos van a tener el mismo largo
      if (!this.filter) {
        this.totalRows = this.importItems.length
      }
    },
    add (el, shippingType) {
      if (!this.validateNumericValues(el)) return
      let newRow = {}

      newRow = {
        numericCode: el.numericCode,
        zone: el.zone
      }

      let searchTypes = this.provider.shippingZones && this.provider.shippingZones.filter(type => type.shippingType === shippingType)

      switch (shippingType) {
        case 1:
        case 2:
          if (searchTypes.length) {
            searchTypes[0].countries.push(newRow)
          } else {
            this.provider.shippingZones.push({
              shippingType: shippingType,
              countries: [newRow]
            })
          }
          break
        case 3:
          // otra cosa
          break
      }
      // reseteo todo y el filtro
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.resetFilter()
    },
    enableEdit (el, shippingType) {
      if (el.numericCode !== undefined && el.numericCode !== null && el.numericCode > -1 && !this.inEdit) {
        this.inEdit = true
        Object.assign(this.oldRow, el)
        let selRow = []

        // console.log(shippingType)

        switch (shippingType) {
          case 1:
            selRow = this.iCountriesList.find(country => country.numericCode === el.numericCode)
            break
          case 2:
            selRow = this.eCountriesList.find(country => country.numericCode === el.numericCode)
            break
          case 3:
            // otra cosa
            break
        }
        // console.log(selRow)
        selRow.edit = true
        this.resetFilter()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (el, shippingType) {
      if (el.numericCode !== undefined && el.numericCode !== null && el.numericCode > -1) {
        let selRow = []
        // busco si el proveedor tiene esa categoría de shipping asociada
        let searchTypes = this.provider.shippingZones && this.provider.shippingZones.filter(type => type.shippingType === shippingType)
        let searchCountry = []
        switch (shippingType) {
          case 1:
            selRow = this.iCountriesList.find(country => country.numericCode === el.numericCode)
            searchCountry = searchTypes.length && searchTypes[0].countries && searchTypes[0].countries.filter(country => country.numericCode === el.numericCode)

            if (searchCountry.length) {
              if (el.zone !== this.oldRow.zone) {
                searchCountry[0].zone = el.zone
                this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
              }
            } else {
              this.add(el, shippingType)
            }
            break
          case 2:
            selRow = this.eCountriesList.find(country => country.numericCode === el.numericCode)
            searchCountry = searchTypes.length && searchTypes[0].countries && searchTypes[0].countries.filter(country => country.numericCode === el.numericCode)

            if (searchCountry.length) {
              if (el.zone !== this.oldRow.zone) {
                searchCountry[0].zone = el.zone
                this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
              }
            } else {
              this.add(el, shippingType)
            }
            break
          case 3:
            // otra cosa
            break
        }

        delete selRow.edit
        this.oldRow = {}
        this.resetFilter()
      }
      this.inEdit = false
    },
    revertEdit (el, shippingType) {
      if (el.numericCode !== undefined && el.numericCode !== null && el.numericCode > -1) {
        Object.assign(el, this.oldRow)
        let selRow = []

        switch (shippingType) {
          case 1:
            selRow = this.iCountriesList.find(country => country.numericCode === el.numericCode)
            break
          case 2:
            selRow = this.eCountriesList.find(country => country.numericCode === el.numericCode)
            break
          case 3:
            // otra cosa
            break
        }
        delete selRow.edit
        this.oldRow = {}
        this.resetFilter()
      }
      this.inEdit = false
    },
    filtered (totalRows) {
      this.totalRows = totalRows.length
      // domestic total rows
    },
    validateNumericValues (row) {
      let retVal = true
      if (isNaN(row.zone) | row.zone === undefined | row.zone === null | row.zone <= 0) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido para la Zona' })
        retVal = false
      }
      return retVal
    }
  },
  computed: {
    ...mapGetters(['provider'])
  }
}
</script>
