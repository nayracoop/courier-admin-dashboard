<template>
  <b-form>
    <b-row>
      <b-col sm="12">
        <b-table hover fixed outlined small responsive="sm"
        :items="items"
        :fields="fields"
        :foot-clone="true"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        no-sort-reset
        @filtered="filtered">
          <template slot="fromDate" slot-scope="data">
            <!-- <div>
              {{ data.item.fromDate }}
            </div> -->
            <div class="input-group datepicker-group" :style="data.item.edit ? '' : 'pointer-events:none'">
              <flat-pickr
              :readonly="(inProgress || !data.item.edit) ? true : false"
              v-validate="'date_format:YYYY-MM-DD'"
              v-model="data.item.fromDate"
              data-vv-as="fecha inicial"
              name="initialDate"
              id="initialDate"
              class="form-control"
              :config="config"
              placeholder="Seleccionar fecha de inicio"></flat-pickr>
              <b-input-group-append v-if="data.item.edit">
                <b-input-group-text>
                  <a class="input-button" title="Seleccionar fecha de inicio" data-toggle>
                    <i class="fa fa-calendar"></i>
                  </a>
                </b-input-group-text>
              </b-input-group-append>
            </div>
          </template>
          <!-- estos dos están deshabilitados siempre en el client -->
          <template slot="toDate" slot-scope="data">
            <div class="input-group datepicker-group" :style="data.item.edit ? '' : 'pointer-events:none'">
              <flat-pickr
                :readonly="(inProgress || !data.item.edit) ? true : false"
                v-validate="'date_format:YYYY-MM-DD|after:'+ data.item.fromDate +',inclusion:true'"
                v-model="data.item.toDate"
                data-vv-as="fecha final"
                name="finalDate"
                id="finalDate"
                class="form-control"
                :config="config"
                placeholder="Seleccionar fecha de finalización"></flat-pickr>
              <b-input-group-append v-if="data.item.edit">
                <b-input-group-text>
                  <a class="input-button" title="Seleccionar fecha de finalización" data-toggle>
                    <i class="fa fa-calendar"></i>
                  </a>
                </b-input-group-text>
              </b-input-group-append>
            </div>
          </template>
          <template slot="fuelPercent" slot-scope="data">
            <b-form-input :readonly="(inProgress || !data.item.edit) ? true : false" type="number" placeholder="% Costo Combustible" v-model.number="data.item.fuelPercent"></b-form-input>
          </template>

          <template slot="actions" slot-scope="data">
            <template v-if="data.item.deleted">
              <span class="mr-1">¿Seguro?</span>
              <b-button size="sm" variant="danger" @click.prevent="confirmRemove(data.item)">
                Si
              </b-button>
              <b-button size="sm" variant="success" @click.prevent="restore(data.item)">
                No
              </b-button>
            </template>
            <template v-if="data.item.edit && !data.item.deleted">
              <b-button size="sm" variant="primary" @click.prevent="applyEdit(data.item)">
                <i class="fa fa-check"></i> Aplicar
              </b-button>
              <b-button size="sm" variant="warning" @click.prevent="revertEdit(data.item)">
                Cancelar
              </b-button>
              <b-button size="sm" variant="danger" @click.prevent="remove(data.item)">
                <i class="fa fa-trash-o"></i> Eliminar
              </b-button>
              <!-- <b-link :to="{ path: '/proveedores' }">Eliminar</b-link> -->
            </template>
            <template v-else-if="!data.item.deleted">
              <b-button size="sm" variant="primary" @click.prevent="enableEdit(data.item)">
                <i class="fa fa-edit"></i> Editar
              </b-button>
            </template>
          </template>

          <template slot="FOOT_fromDate" slot-scope="data">
            <div class="input-group datepicker-group">
              <flat-pickr
                :disabled="inProgress"
                v-validate="'date_format:YYYY-MM-DD'"
                v-model="newRow.fromDate"
                data-vv-as="fecha inicial"
                name="newInitialDate"
                id="newInitialDate"
                class="form-control"
                :config="config"
                placeholder="Seleccionar fecha de inicio"></flat-pickr>
              <b-input-group-append>
                <b-input-group-text>
                  <a class="input-button" title="Seleccionar fecha de inicio" data-toggle>
                    <i class="fa fa-calendar"></i>
                  </a>
                </b-input-group-text>
              </b-input-group-append>
            </div>
          </template>
          <template slot="FOOT_toDate" slot-scope="data">
            <div class="input-group datepicker-group">
              <flat-pickr
                :disabled="inProgress"
                v-validate="'date_format:YYYY-MM-DD|after:'+ newRow.fromDate +',inclusion:true'"
                v-model="newRow.toDate"
                data-vv-as="fecha final"
                name="newFinalDate"
                id="newFinalDate"
                class="form-control"
                :config="config"
                placeholder="Seleccionar fecha de finalización"></flat-pickr>
              <b-input-group-append>
                <b-input-group-text>
                  <a class="input-button" title="Seleccionar fecha de finalización" data-toggle>
                    <i class="fa fa-calendar"></i>
                  </a>
                </b-input-group-text>
              </b-input-group-append>
            </div>
          </template>
          <template slot="FOOT_fuelPercent" slot-scope="data">
            <b-form-input type="number" placeholder="% Costo Combustible" v-model.number="newRow.fuelPercent" :disabled="inProgress"></b-form-input>
          </template>
          <template slot="FOOT_actions" slot-scope="data">
            <b-button size="sm" variant="success" @click.prevent="add">
              <i class="fa fa-plus"></i> Agregar
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { mapGetters } from 'vuex'
import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es'

export default {
  name: 'c-fuel-table',
  components: { flatPickr },
  props: {
    filter: { type: String }
  },
  data () {
    return {
      fields: [
        { key: 'fromDate', label: 'Fecha inicial' },
        { key: 'toDate', label: 'Fecha final' },
        { key: 'fuelPercent', label: '% Costo Combustible' },
        { key: 'actions', label: 'Acciones', class: 'fuel-cost-actions' }
      ],
      items: [],
      newRow: {
        id: null,
        fromDate: null,
        toDate: null,
        fuelPercent: null
      },
      // sortBy: [ 'fromDate', 'fuelPercent' ],
      sortBy: 'fromDate',
      sortDesc: true,
      inProgress: false,
      inEdit: false,
      oldRow: {},
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      config: {
        wrap: true,
        dateFormat: 'Y-m-d',
        locale: Spanish,
        altFormat: 'j \\de F \\de Y',
        altInput: true
        // clickOpens: false
      }
    }
  },
  created () {
    this.items = this._.cloneDeep(this.provider.fuelTable)
    // this.items.forEach(item => {
    //   item.config = this._.cloneDeep(this.config)
    //   item.config.clickOpens = false
    // })
  },
  methods: {
    add () {
      if (!this.validateNumericValues(this.newRow)) return
      if (!this.validateDates(this.newRow)) return
      this.newRow.id = Math.max.apply(Math, this.provider.fuelTable.map((item) => { return item.id })) + 1 // this.provider.fuelTable.length
      this.provider.fuelTable.push(this.newRow)
      this.items = this._.cloneDeep(this.provider.fuelTable)
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.newRow = {}
    },
    remove (el) {
      let selRow = this.provider.fuelTable.find(fuel => fuel.id === el.id)

      const index = this.provider.fuelTable.indexOf(selRow)
      this.provider.fuelTable.splice(index, 1)

      el.deleted = true
      el._rowVariant = 'warning'
    },
    confirmRemove (el) {
      this.items = this._.cloneDeep(this.provider.fuelTable)
      this.inEdit = false
    },
    restore (el) {
      delete el.deleted
      delete el._rowVariant
      this.provider.fuelTable.push(el)
      // this.revertEdit(el)
    },
    enableEdit (el) {
      if (!this.inEdit) {
        this.inEdit = true
        Object.assign(this.oldRow, el)
        let selRow = this.provider.fuelTable.find(fuel => fuel.id === el.id)
        selRow.edit = true
        this.items = this._.cloneDeep(this.provider.fuelTable)
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (el) {
      if (!this.validateNumericValues(el)) return
      let selRow = this.provider.fuelTable.find(fuel => fuel.id === el.id)
      if (el.fromDate !== this.oldRow.fromDate ||
        el.toDate !== this.oldRow.toDate ||
        el.fuelPercent !== this.oldRow.fuelPercent) {
        selRow.fromDate = el.fromDate
        selRow.toDate = el.toDate
        selRow.fuelPercent = el.fuelPercent
        this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      }
      delete selRow.edit
      this.items = this._.cloneDeep(this.provider.fuelTable)
      this.oldRow = {}
      this.inEdit = false
    },
    revertEdit (el) {
      Object.assign(el, this.oldRow)
      let selRow = this.provider.fuelTable.find(fuel => fuel.id === el.id)
      delete selRow.edit
      this.items = this._.cloneDeep(this.provider.fuelTable)
      this.oldRow = {}
      this.inEdit = false
    },
    filtered (totalRows) {
      this.totalRows = totalRows.length
    },
    validateNumericValues (row) {
      let retVal = true
      if (!row.fuelPercent) row.fuelPercent = 0
      if (isNaN(row.fuelPercent) | row.fuelPercent < 0 | row.fuelPercent > 100) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido para % Descuento Costo' })
        retVal = false
      }
      return retVal
    },
    validateDates (row) {
      let retVal = true
      if (!row.fromDate || !row.toDate) {
        this.$toasted.global.error_toast({ message: 'Ingrese Fecha inicial y Fecha final' })
        retVal = false
      } else if (row.fromDate >= row.toDate) {
        this.$toasted.global.error_toast({ message: 'La Fecha inicial no puede ser mayor a la Fecha final' })
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

<style scoped>
  /* tbody .datepicker-group input[readonly] ~ * {
    pointer-events: none;
  }
  tbody tr {
    background-color: #f9f9f9;
  } */
</style>
