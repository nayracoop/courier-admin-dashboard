<template>
  <b-form>
    <b-row>
      <b-col sm="12">
        <b-table hover striped bordered small fixed responsive="sm"
        :items="items"
        :fields="fields"
        :foot-clone="true"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="filtered">
          <template slot="fromDate" slot-scope="data">
            <div class="input-group datepicker-group">
              <flat-pickr
                :readonly="(inProgress || !data.item.edit) ? true : false"
                v-validate="'date_format:DD/MM/YYYY'"
                v-model="data.item.fromDate"
                data-vv-as="fecha inicial"
                name="initialDate"
                id="initialDate"
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
          <!-- estos dos están deshabilitados siempre en el client -->
          <template slot="toDate" slot-scope="data">
            <div class="input-group datepicker-group">
              <flat-pickr
                :readonly="(inProgress || !data.item.edit) ? true : false"
                v-validate="'date_format:DD/MM/YYYY|after:'+ data.item.fromDate +',inclusion:true'"
                v-model="data.item.toDate"
                data-vv-as="fecha final"
                name="finalDate"
                id="finalDate"
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
          <template slot="fuelPercent" slot-scope="data">
            <b-form-input :readonly="(inProgress || !data.item.edit) ? true : false" type="number" placeholder="% Costo Combustible" v-model.number="data.item.fuelPercent"></b-form-input>
          </template>

          <template slot="actions" slot-scope="data">
            <template v-if="data.item.edit">
              <b-button v-b-tooltip.hover title="Descartar cambios" variant="warning" @click.prevent="revertEdit(data.item)">
                <i class="fa fa-undo"></i>
              </b-button>
              <b-button v-b-tooltip.hover title="Aplicar cambios" variant="primary" @click.prevent="applyEdit(data.item)">
                <strong><i class="fa fa-check"></i></strong>
              </b-button>
            </template>
            <template v-else>
              <b-button  v-b-tooltip.hover title="Editar fila" variant="primary" @click.prevent="enableEdit(data.item)">
                <strong><i class="fa fa-edit"></i></strong>
              </b-button>
            </template>
          </template>

          <template slot="FOOT_fromDate" slot-scope="data">
            <div class="input-group datepicker-group">
              <flat-pickr
                :disabled="inProgress"
                v-validate="'date_format:DD/MM/YYYY'"
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
                v-validate="'date_format:DD/MM/YYYY|after:'+ newRow.fromDate +',inclusion:true'"
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
            <b-button v-b-tooltip.hover title="Añadir costo" variant="secondary" @click.prevent="add">
              <strong><i class="fa fa-plus"></i></strong>
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <pre>{{ `proveedor fuel: ${JSON.stringify(this.provider && this.provider.fuelTable, null, 2)}` }}</pre>
    <pre>{{ `items: ${JSON.stringify(this.provider && this.items, null, 2)}` }}</pre>
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
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],
      items: [],
      newRow: {
        id: null,
        fromDate: null,
        toDate: null,
        fuelPercent: null
      },
      inProgress: false,
      inEdit: false,
      oldRow: {},
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      config: {
        wrap: true,
        dateFormat: 'd/m/Y',
        locale: Spanish,
        altFormat: 'j \\de F, Y',
        altInput: true
      }
    }
  },
  created () {
    this.items = this._.cloneDeep(this.provider.fuelTable)
  },
  methods: {
    add () {
      if (!this.validateNumericValues(this.newRow)) return
      this.newRow.id = this.provider.fuelTable.length
      this.provider.fuelTable.push(this.newRow)
      this.items = this._.cloneDeep(this.provider.fuelTable)
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.newRow = {}
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
    }
  },
  computed: {
    ...mapGetters(['provider'])
  }
}
</script>
