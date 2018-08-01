<template>
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
            <strong>Nuevo envío</strong>
          </div>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="clientName">Cliente</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del cliente"></i>
                <b-form-select id="clientName" :plain="true" :options="['Sivori','AT Capital']" value="1">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="providerName">Proveedor</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del proveedor"></i>
                <b-form-select id="providerName" :plain="true" :options="['Sivori','AT Capital']" value="Nombre Proveedor">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="shippingType">Tipo de envío</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
                <b-form-select id="shippubgType" :plain="true" :options="shippingTypes" value="1">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="serviceType">Servicio</label>
                <i class="fa fa-question-circle fa-sm"></i>
                <b-form-select id="serviceType" :plain="true" :options="serviceTypes" value="Tipo de servicio">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="actualDate">Fecha actual</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                <div class="input-group datepicker-group">
              <flat-pickr
                v-model="adate"
                id="actualDate"
                class="form-control"
                :config="config"
                placeholder="Seleccionar fecha actual"></flat-pickr>
                <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha actual" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
                </div>
                <!--b-form-input type="text" id="actualDate" placeholder="Ej: 27/06/2018" :value="_"></b-form-input-->
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="closeDate">Fecha de cierre</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                <div class="input-group datepicker-group">
              <flat-pickr
                v-model="cdate"
                id="closeDate"
                class="form-control"
                :config="config"
                placeholder="Seleccionar fecha de cierre"></flat-pickr>
                <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha de cierre" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
                </div>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
</template>

<script>
import { shippingTypes, serviceTypes } from '@/store/const'
import flatPickr from 'vue-flatpickr-component'
import {Spanish} from 'flatpickr/dist/l10n/es'

export default {
  name: 'c-shipping-data',
  components: {
    flatPickr
  },
  data () {
    return {
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      adate: null,
      fdate: null,
      config: {
        wrap: true,
        dateFormat: 'd-m-Y',
        locale: Spanish
      }
    }
  }
}
</script>
