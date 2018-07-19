<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab v-bind:title=" isEdit ? provider.name : 'Nuevo proveedor'" active>
                <div slot="header">
                  <strong>{{ isEdit ? provider.name : 'Nuevo proveedor' }}</strong>
                </div>
                <c-provider-detail :provider="provider" :isEdit="isEdit"></c-provider-detail>
              </b-tab>
              <b-tab title="Precios de venta" v-if="provider.isShipping">
                <c-cost-table :provider="provider"></c-cost-table>
              </b-tab>
          </b-tabs>
          <b-row class="actions-bar">
            <b-col sm="12">
              <b-button variant="outline-primary" :disabled="inProgress" type="submit">Guardar</b-button>
              <b-button variant="outline-primary" :disabled="inProgress" v-if="isEdit" @click="deleteProvider(provider.objectId)">Eliminar</b-button>
              <b-button variant="outline-primary" @click="$router.go(-1)">Volver</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import CCostTable from '@/components/CostTable'
import CProviderDetail from '@/components/ProviderDetail'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: {
    CErrorList,
    CCostTable,
    CProviderDetail
  },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(PROVIDER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(
        FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      )
    }
    return next()
  },
  async beforeRouteLeave (to, from, next) {
    await store.dispatch(PROVIDER_RESET_STATE)
    next()
  },
  data () {
    return {
      inProgress: false,
      errors: {}
    }
  },
  computed: {
    ...mapGetters(['provider']),
    isEdit () {
      return !!this.provider.objectId
    }
  },
  methods: {
    onSave (id, provider) {
      var $this = this
      let action = id ? PROVIDER_EDIT : PROVIDER_SAVE
      $this.inProgress = true
      $this.$store
        .dispatch(action)
        .then(myProvider => {
          $this.inProgress = false
          $this.$router.push({
            name: 'Editar Proveedor',
            params: {
              id: myProvider.id
            }
          })
        }, error => {
          console.log(error)
        })
    },
    deleteProvider (id) {
      this.$store
        .dispatch(PROVIDER_DELETE, id)
        .then(res => {
          this.$router.push('/proveedores')
        }, error => {
          // mostrar errores
          console.log('error')
          console.log(error)
        })
    }
  }
}
</script>
