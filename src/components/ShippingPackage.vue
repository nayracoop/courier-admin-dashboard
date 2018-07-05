<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="packageType">Embalaje</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
          <b-form-select id="packageType" :plain="true" :options="packageTypes" value="Tipo de embalaje">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <span>Medidas</span>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Dimensiones del paquete en centímetros"></i>
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
          <b-form-select id="packageType" :plain="true" :options="['Cajas', 'Pack', 'Sobre']" value="Tipo de embalaje">
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
  </b-form>
</template>

<script>
export default {
  name: 'c-shipping-package'
}
</script>
