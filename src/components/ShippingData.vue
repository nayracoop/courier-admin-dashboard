<template>
    <!-- <b-card> -->
      <!-- <div slot="header">Envío</div> -->
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="clientName" class="required-label">Nombre o razón social del cliente</label>
            <b-form-select :class="{ 'is-invalid': errors.has('clientName') }" v-validate="'required'" name="clientName" id="clientName" :plain="true" :options="clientList" v-model="shipping.clientId" @input="fetchClient" />
          </b-form-group>
          <b-form-row>
            <b-col sm="6">
              <b-form-group>
                <label for="shippingType" class="required-label">Tipo de envío</label>
                <!-- <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i> -->
                <b-form-select :class="{ 'is-invalid': errors.has('shippingType') }" v-validate="'required'" name="shippingType" id="shippingType" :plain="true" :options="shippingTypes" v-model="shipping.shippingType" />
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="serviceType" class="required-label">Servicio</label>
                <!-- <i class="fa fa-question-circle fa-sm"></i> -->
                <b-form-select :class="{ 'is-invalid': errors.has('serviceType') }" v-validate="'required'" name="serviceType" id="serviceType" :plain="true" :options="serviceTypes" v-model="shipping.serviceType" />
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="providerName" class="required-label">Proveedor</label>
            <b-form-select :class="{ 'is-invalid': errors.has('providerName') }" v-validate="'required'" name="providerName" id="providerName" :plain="true" :options="providerList" v-model="shipping.providerId" @input="fetchProvider" />
          </b-form-group>
          <b-form-row>
            <b-col sm="12">
              <b-form-group>
                <label for="initialDate" class="required-label">Fecha</label>
                <!-- <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i> -->
                <div class="input-group datepicker-group">
                  <flat-pickr
                  v-validate="'date_format:YYYY-MM-DD'"
                  v-model="shipping.initialDate"

                  name="initialDate"
                  id="initialDate"
                  class="form-control"
                  :config="config"
                  placeholder="Seleccionar fecha actual"></flat-pickr>
                  <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha actual" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
                </div>
                <!--b-form-input type="text" id="initialDate" placeholder="Ej: 27/06/2018" :value="_"></b-form-input-->
              </b-form-group>
            </b-col>
            <!-- <b-col sm="6">
            <b-form-group>
            <label for="finalDate">Fecha de cierre</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <div class="input-group datepicker-group">
            <flat-pickr
            v-validate="'date_format:YYYY-MM-DD|after:'+ shipping.initialDate +',inclusion:true'"
            v-model="shipping.finalDate"
            data-vv-as="fecha de cierre"
            name="finalDate"
            id="finalDate"
            :class="'form-control ' + { 'is-invalid': errors.has('finalDate') }"
            :config="config"
            placeholder="Seleccionar fecha de cierre"></flat-pickr>
            <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha de cierre" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
          </div>
          <span><small class="inv-feedback" v-show="errors.has('finalDate')">{{ errors.first('finalDate') }}</small></span>
        </b-form-group>
      </b-col> -->
    </b-form-row>

        </b-col>
      </b-row>
    <!-- </b-card> -->
</template>

<script>
import { mapGetters } from 'vuex'

import { shippingTypes, serviceTypes } from '@/store/const'
// import { FETCH_CLIENT } from '@/store/types/actions'
import { FETCH_CLIENT, FETCH_PROVIDER } from '@/store/types/actions'

import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es'

export default {
  name: 'c-shipping-data',
  components: {
    flatPickr
  },
  data () {
    return {
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      cleanObject: null,
      config: {
        wrap: true,
        dateFormat: 'Y-m-d',
        locale: Spanish,
        altFormat: 'j \\de F \\de Y',
        altInput: true
        // allowInput: true
      }
    }
  },
  props: {
    clientList: { type: Array },
    providerList: { type: Array }
  },
  computed: {
    ...mapGetters([ 'shippingLoading', 'clients', 'providers', 'shipping', 'client', 'provider' ]),
    isEdit () {
      return !!this.shipping.objectId
    }
  },
  methods: {
    fetchClient (id) {
      this.$store.dispatch(FETCH_CLIENT, id, null).then(() => {
        this.$eventHub.$emit('refreshAddresses')
      })
    },
    fetchProvider (id) {
      this.$store.dispatch(FETCH_PROVIDER, id, null)
    },
    validate () {
      return this.$validator.validateAll()
    }
  },
  created () {
    this.shipping.initialDate = this.shipping.initialDate || new Date().toJSON().slice(0, 10)
  }
}
</script>
