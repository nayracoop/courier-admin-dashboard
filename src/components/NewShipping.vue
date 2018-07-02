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
                <label for="shippType">Tipo de envío</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
            <b-form-select id="shippType"
              :plain="true"
              :options="['Importación','Exportación','Doméstico']"
              value="1">
            </b-form-select>
            </b-form-group>
            </b-col>
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
          </b-row>
          <b-row>            
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
            <b-col sm="6">
              <b-form-group>
                <label for="serviceType">Servicio</label>
                <i class="fa fa-question-circle fa-sm"></i>
            <b-form-select id="serviceType"
              :plain="true"
              :options="['Doméstico', 'Economy', 'Priority']"
              value="Tipo de servicio">
            </b-form-select>
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
                <span>Medidas</span> <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Dimensiones del paquete en centímetros"></i>
            <label for="length">Largo</label>
            <b-form-input type="text" id="length" placeholder="" :value="weight"></b-form-input>
            <label for="width">Ancho</label>
            <b-form-input type="text" id="width" placeholder="" :value="weight"></b-form-input>
            <label for="height">Alto</label>
            <b-form-input type="text" id="height" placeholder="" :value="weight"></b-form-input>
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
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import { serviceType } from "@/store/const/constVars";
import { packageType } from "@/store/const/constVars";
import { shippingType } from "@/store/const/constVars";
import { taxType } from "@/store/const/constVars";

export default {
name: 'c-new-shipping',

data() {
    return {
      serviceTypes: serviceType,
      packageTypes: packageType,
      taxTypes: taxType,
      shippingTypes: shippingType
      
    };
  }
}