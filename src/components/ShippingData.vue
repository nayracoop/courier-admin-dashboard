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
                <b-form-input type="text" id="actualDate" placeholder="Ej: 27/06/2018" :value="_"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="closeDate">Fecha de cierre</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                <b-form-input type="text" id="closeDate" placeholder="Ej: 27/06/2018" :value="_"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
</template>

<script>
import { shippingType, serviceType } from '@/store/const'

export default {
  name: 'c-shipping-data',
  data () {
    return {
      shippingTypes: shippingType,
      serviceTypes: serviceType
    }
  }
}
</script>
