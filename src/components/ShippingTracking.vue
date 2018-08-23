<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="trackingNumber">Número de guía</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de guía del envío"></i>
          <b-form-input type="text" id="trackingNumber" placeholder="Ej: 4172-1248-12"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="flightDate">Fecha de vuelo</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <div class="input-group datepicker-group">
        <flat-pickr
          v-model="fdate"
          id="flightDate"
          class="form-control"
          :config="config"
          placeholder="Seleccionar fecha de vuelo"></flat-pickr>
          <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha de vuelo" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
          </div>
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
import flatPickr from 'vue-flatpickr-component'
import {Spanish} from 'flatpickr/dist/l10n/es'
export default {
  name: 'c-shipping-tracking',
  components: {
    flatPickr
  },
  data () {
    return {
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
