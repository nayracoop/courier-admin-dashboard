<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="package">Tipo de embalaje</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
          <b-form-select id="package" :plain="true" :options="packageTypes" value="Tipo de embalaje">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <label for="weight">Peso</label>
        <b-input-group>
        <b-form-input horizontal type="text" id="weight" placeholder=""></b-form-input>
        <b-input-group-append><b-input-group-text>kg</b-input-group-text></b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="packageValue">Valor declarado</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Valor declarado del paquete"></i>
          <b-form-input type="text" id="packageValue" placeholder="Ej: $2500"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="guideENumber">Número de referencia</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de referencia del envío"></i>
          <b-form-input type="text" id="guideENumber" placeholder="Ej: 4172-1248-12"></b-form-input>
        </b-form-group>
      </b-col>
      </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <span>Medidas</span>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Dimensiones del paquete en centímetros"></i>
          <b-row class="mt-2">
            <b-col sm="4">
              <label for="length">Largo</label>
              <b-input-group>
              <b-form-input horizontal type="text" id="length" placeholder=""></b-form-input>
              <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col sm="4">
              <label for="width">Ancho</label>
              <b-input-group>
              <b-form-input horizontal type="text" id="width" placeholder=""></b-form-input>
              <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col sm="4">
              <label for="width">Alto</label>
              <b-input-group>
              <b-form-input horizontal type="text" id="height" placeholder=""></b-form-input>
              <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { packageTypes } from '@/store/const'

export default {
  name: 'c-shipping-package',
  data () {
    return {
      packageTypes: packageTypes
    }
  }
}
</script>
