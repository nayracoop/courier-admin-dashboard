<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="trackingNumber">Número de guía</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de guía del envío"></i>
          <b-form-input type="text" id="trackingNumber" placeholder="Ej: 4172-1248-12" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="flightDate">Fecha de vuelo</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-input type="text" id="flightDate" placeholder="Ej: 27/06/2018" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="pdfAttachment">Adjuntar PDF</label>
          <b-form-file v-model="file" :state="Boolean(file)" placeholder="Elija un archivo..." id="pdfAttachment"></b-form-file>
  <div class="mt-2">Archivo seleccionado: {{file && file.name}}</div>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'c-shipping-tracking'
}
</script>
