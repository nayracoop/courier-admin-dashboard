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
            <b-form-select id="clientName"
              :plain="true"
              :options="['Sivori','AT Capital']"
              value="1">
            </b-form-select>
            </b-form-group>
            </b-col>            
            <b-col sm="6">
              <b-form-group>
                <label for="providerName">Proveedor</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del proveedor"></i>
            <b-form-select id="providerName"
              :plain="true"
              :options="['Sivori','AT Capital']"
              value="Nombre Proveedor">
            </b-form-select>
            </b-form-group>
            </b-col>
          </b-row>
          <b-row>
             <b-col sm="6">
              <b-form-group>
                <label for="shippType">Tipo de envío</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
            <b-form-select id="shippType"
              :plain="true"
              :options="shippingTypes"
              value="1">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="serviceType">Servicio</label>
                <i class="fa fa-question-circle fa-sm"></i>
            <b-form-select id="serviceType"
              :plain="true"
              :options="serviceTypes"
              value="Tipo de servicio">
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
          <c-shipping-from></c-shipping-from>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion2 variant="info">Enviar hasta</b-btn>
      </b-card-header>
      <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <p class="card-text">
            I start opened because <code>visible</code> is <code>true</code>
          </p>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion3 variant="info">Información del paquete</b-btn>
      </b-card-header>
      <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="packageType">Embalaje</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
            <b-form-select id="packageType"
              :plain="true"
              :options="packageTypes"
              value="Tipo de embalaje">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <span>Medidas</span> <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Dimensiones del paquete en centímetros"></i>
            <b-row>
              <b-col sm="4">
              <label for="length">Largo</label>
            <b-form-input horizontal type="text" id="length" placeholder="" :value="weight"></b-form-input>
            </b-col>
            <b-col sm="4">
            <label for="width">Ancho</label>
            <b-form-input horizontal type="text" id="width" placeholder="" :value="weight"></b-form-input>
            </b-col>
            <b-col sm="4">
            <label for="height">Alto</label>
            <b-form-input horizontal type="text" id="height" placeholder="" :value="weight"></b-form-input>
            </b-col>
            </b-row>
            </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="packageType">Embalaje</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
            <b-form-select id="packageType"
              :plain="true"
              :options="['Cajas', 'Pack', 'Sobre']"
              value="Tipo de embalaje">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="weight">Peso</label>
                <i class="fa fa-question-circle fa-sm"></i>
            <b-form-input type="text" id="weight" placeholder="" :value="weight"></b-form-input>
            </b-form-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion4 variant="info">Servicio</b-btn>
      </b-card-header>
      <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <p class="card-text">
            I start opened because <code>visible</code> is <code>true</code>
          </p>
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
            I start opened because <code>visible</code> is <code>true</code>
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
} from "@/store/const/constVars";

import CShippingFrom from '@/components/ShippingFrom'

export default {
  name: "c-new-shipping",
  components: { CShippingFrom },
  data() {
    return {
      serviceTypes: serviceType,
      packageTypes: packageType,
      shippingTypes: shippingType
    };
  }
};
</script>
