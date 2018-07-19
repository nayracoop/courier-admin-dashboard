<template>
  <div class="animated fadeIn">
    <c-shipping-data></c-shipping-data>
    <div role="tablist" class="mb-3">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion1>Enviar desde</b-btn>
        </b-card-header>
        <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address></c-address>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion2>Enviar hasta</b-btn>
        </b-card-header>
        <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address></c-address>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion3>Información del paquete</b-btn>
        </b-card-header>
        <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-shipping-package></c-shipping-package>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion4>Información de seguimiento</b-btn>
        </b-card-header>
        <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-shipping-tracking></c-shipping-tracking>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <template>
      <b-row class="actions-bar">
        <b-col sm="12">
          <b-button variant="outline-primary" type="submit">Guardar</b-button>
          <b-button variant="outline-danger">Eliminar</b-button>
          <b-button variant="outline-primary">Volver</b-button>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { serviceTypes, packageTypes, shippingTypes } from '@/store/const'

import CShippingData from '@/components/ShippingData'
import CAddress from '@/components/Address'
import CShippingPackage from '@/components/ShippingPackage'
import CShippingTracking from '@/components/ShippingTracking'

export default {
  name: 'v-shipping',
  components: {
    CShippingData,
    CAddress,
    CShippingPackage,
    CShippingTracking
  },
  data () {
    return {
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingTypes: shippingTypes
    }
  }
}
</script>
