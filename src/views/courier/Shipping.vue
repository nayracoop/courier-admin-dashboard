<template>
  <div class="animated fadeIn">
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
                <label for="shippType">Tipo de envío</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
                <b-form-select id="shippType" :plain="true" :options="shippingTypes" value="1">
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
        </b-card>
      </b-col>
    </b-row>

    <div role="tablist">
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
          <b-btn block href="#" v-b-toggle.accordion2 variant="info">Enviar hasta</b-btn>
        </b-card-header>
        <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address></c-address>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion3 variant="info">Información del paquete</b-btn>
        </b-card-header>
        <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-shipping-package></c-shipping-package>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion4 variant="info">Servicio</b-btn>
        </b-card-header>
        <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-shipping-tracking></c-shipping-tracking>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion5 variant="info">Información de seguimiento</b-btn>
        </b-card-header>
        <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <p class="card-text">
              I start opened because
              <code>visible</code> is
              <code>true</code>
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  serviceType,
  packageType,
  shippingType
} from '@/store/const'

import CAddress from '@/components/Address'
import CShippingPackage from '@/components/ShippingPackage'
import CShippingTracking from '@/components/ShippingTracking'

export default {
  name: 'v-shipping',
  components: {
    CAddress,
    CShippingPackage,
    CShippingTracking
  },
  data () {
    return {
      serviceTypes: serviceType,
      packageTypes: packageType,
      shippingTypes: shippingType
    }
  }
}
</script>
