<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <CListErrors :errors="errors"/>
          <form v-on:submit.prevent="onSave(provider.id, provider)">
            <fieldset :disabled="inProgress">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="provider.name"
                  placeholder="Nombre del proveedor">
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="provider.observation"
                  placeholder="Observaciones">
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="provider.vatId"
                  placeholder="Identificador">
                </textarea>
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit">
              Guardar proveedor
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import CListErrors from '@/components/ListErrors'
import {
  PROVIDER_SAVE,
  PROVIDER_EDIT,
  FETCH_PROVIDER,
  PROVIDER_RESET_STATE
} from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: { CListErrors },
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
      await store.dispatch(FETCH_PROVIDER,
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
    ...mapGetters([
      'provider'
    ])
  },
  methods: {
    onSave (id, provider) {
      let action = id ? PROVIDER_EDIT : PROVIDER_SAVE
      this.inProgress = true
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false
          this.$router.push({
            name: 'provider',
            params: { id: data.provider.id }
          })
        })
        .catch(({ response }) => {
          this.inProgress = false
          this.errors = response.data.errors
        })
    }
  }
}
</script>
