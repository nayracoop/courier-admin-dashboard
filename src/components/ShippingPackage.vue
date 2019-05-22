<template>
  <div>
    <b-row>
      <b-col sm="4">
        <b-form-group>
          <label for="package" class="required-label">Tipo de embalaje</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
          <b-form-select :class="{ 'is-invalid': errors.has('package') }" v-validate="'required'" id="package" name="package" :plain="true" :options="packageTypes" value="Tipo de embalaje" v-model="shipping.package.type">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group>
          <label for="packageValue" class="required-label">Valor declarado</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Valor declarado del paquete"></i>
          <input class="form-control" :class="{ 'is-invalid': errors.has('packageValue') }" v-validate="'required|min_value:0.1'" type="text" id="packageValue" name="packageValue" placeholder="Ej: $2500" v-model.lazy="shipping.package.declaredValue">
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group>
          <label for="guideENumber">Número de referencia</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de referencia del envío"></i>
          <b-form-input type="text" id="guideENumber" placeholder="Ej: 4172-1248-12" v-model="shipping.package.reference"></b-form-input>
        </b-form-group>
      </b-col>
      </b-row>
      <b-row class="---mt-2">
        <b-col sm="3">
          <label for="weight">Peso</label>
          <b-input-group>
          <b-form-input horizontal type="number" id="weight" placeholder="Peso en kilogramos" v-model="shipping.package.weight"></b-form-input>
          <b-input-group-append><b-input-group-text>kg</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      <b-col sm="9">
        <b-form-group>
          <label for="length">Tamaño (en cm)</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Dimensiones del paquete en centímetros"></i>
          <b-form-row>
            <b-col sm="4">
              <!-- <label for="length">Largo</label> -->
              <b-input-group>
                <b-input-group-prepend><b-input-group-text>Largo:</b-input-group-text></b-input-group-prepend>
                <b-form-input :disabled="shipping.package.type !== 1" horizontal type="number" id="length" placeholder="Largo en centímetros" v-model="shipping.package.length"></b-form-input>
                <!-- <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append> -->
              </b-input-group>
            </b-col>
            <b-col sm="4">
              <!-- <label for="width">Ancho</label> -->
              <b-input-group>
                <b-input-group-prepend><b-input-group-text>Ancho:</b-input-group-text></b-input-group-prepend>
                <b-form-input :disabled="shipping.package.type !== 1" horizontal type="number" id="width" placeholder="Ancho en centímetros" v-model="shipping.package.width"></b-form-input>
                <!-- <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append> -->
              </b-input-group>
            </b-col>
            <b-col sm="4">
              <!-- <label for="width">Alto</label> -->
              <b-input-group>
                <b-input-group-prepend><b-input-group-text>Alto:</b-input-group-text></b-input-group-prepend>
                <b-form-input :disabled="shipping.package.type !== 1" horizontal type="number" id="height" placeholder="Alto en centímetros" v-model="shipping.package.height"></b-form-input>
                <!-- <b-input-group-append><b-input-group-text>cm</b-input-group-text></b-input-group-append> -->
              </b-input-group>
            </b-col>
        </b-form-row>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { packageTypes } from '@/store/const'

export default {
  name: 'c-shipping-package',
  data () {
    return {
      packageTypes: packageTypes
    }
  },
  computed: {
    ...mapGetters([ 'shipping' ])
  },
  methods: {
    validate () {
      return this.$validator.validateAll()
    }
  }
}
</script>
