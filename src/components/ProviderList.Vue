<template>
  <!--div>
    <div v-if="isLoading" class="">
      Cargando...
    </div>
    <div v-else>
      <div v-if="providers.length === 0" class="provider-row">
        No hay proveedores.
      </div>
      <c-provider-row
        v-for="(provider, index) in providers"
        :provider="provider"
        :key="provider.name + index">
      </c-provider-row>
      <v-pagination
        :pages="pages"
        :currentPage.sync="currentPage"
      ></v-pagination>
    </div>
  </div-->

  <b-card :header="caption">  
    <template>      
            <b-row class="actions-bar">
                <b-col sm="6">
                  <b-button class="btn-primary" variant="btn-primary">Nuevo proveedor</b-button>
                  <b-button variant="outline-primary">Importar</b-button>
                  <b-button variant="outline-danger ">Eliminar</b-button>
                </b-col>
          <b-form-group class="ml-auto col-6">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
          </b-row>
          </template>
    <b-table
      :hover="hover"
      :striped="striped"
      :bordered="bordered"
      :small="small"
      :fixed="fixed"
      :items="providers"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
       @filtered="onFiltered"
      responsive="sm">
    <template slot="Acciones" slot-scope="data">
      <router-link tag="b-button" class="btn-primary" variant="btn-primary" :to="{ name: 'Provider', params: { id: data.item.id } }">
        <i class="fa fa-pencil"></i>
      </router-link>
      <router-link tag="b-button" to="charts" :small="small" :to="{ name: 'NewShipping' }">
        <i class="fa fa-plane"></i>
      </router-link>
      <router-link tag="b-button" class="btn-danger" to="charts" :small="small">
        <i class="fa fa-trash"></i>
      </router-link>
    </template>
    </b-table>
    <nav>
      <b-pagination
        :total-rows="providersCount"
        :per-page="perPage"
        v-model="currentPage"
        prev-text="Anterior"
        next-text="Siguiente"
        hide-goto-end-buttons />
    </nav>
  </b-card>
</template>

<script>

import { mapGetters } from 'vuex'
import { FETCH_PROVIDERS } from '@/store/types/actions'
export default {
  name: 'c-provider-list',
  props: {
    caption: {
      type: String,
      default: 'Proveedores'
    },
    hover: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      fields: [
        {key: 'name', label: 'Nombre', sortable: true, editable: true},
        {key: 'userCode', label: 'Código', sortable: true},
        {key: 'vatId', label: 'CUIT', sortable: true},
        {key: 'taxType', label: 'CondiciónIVA'},
        {key: 'phone', label: 'Teléfono'},
        {key: 'address', label: 'Dirección'},
        {key: 'email', label: 'Email', sortable: true},
        {key: 'province', label: 'Provincia'},
        {key: 'Acciones'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      filter: null

    }
  },
  computed: {
     ...mapGetters([
      'providersCount',
      'isLoading',  
      'providers'
    ])
  },
   mounted () {
    this.fetchProviders()
  },
  methods: {
    fetchProviders () {
      this.$store.dispatch(FETCH_PROVIDERS)
    }
  //   resetPagination () {
  //     this.listConfig.offset = 0
  //     this.currentPage = 1
  //   }
  }
}

/* import { mapGetters } from 'vuex'
import CProviderRow from '@/components/ProviderRow'
//   import VPagination from '@/components/VPagination'
import { FETCH_PROVIDERS } from '@/store/types/actions'

export default { 
  
  name: 'c-provider-list',
  components: {
    CProviderRow
  //   VPagination
  },
  // props: {
  //   type: {
  //     type: String,
  //     required: false,
  //     default: 'all'
  //   },
  //   name: {
  //     type: String,
  //     required: false
  //   }
  //   itemsPerPage: {
  //     type: Number,
  //     required: false,
  //     default: 10
  //   }
  // }
  // data () {
  //   return {
  //     currentPage: 1
  //   }
  // },
  computed: {
  //   listConfig () {
  //     const { type } = this
  //     const filters = {
  //       offset: (this.currentPage - 1) * this.itemsPerPage,
  //       limit: this.itemsPerPage
  //     }
  //     if (this.author) {
  //       filters.author = this.author
  //     }
  //     if (this.tag) {
  //       filters.tag = this.tag
  //     }
  //     if (this.favorited) {
  //       filters.favorited = this.favorited
  //     }
  //     return {
  //       type
  //       filters
  //     }
  //   },
  //   pages () {
  //     if (this.isLoading) || this.providersCount <= this.itemsPerPage) {
  //       return []
  //     }
  //     return [...Array(Math.ceil(this.articlesCount / this.itemsPerPage)).keys()].map(e => e + 1)
  //   },
    ...mapGetters([
      'providersCount',
      'isLoading',
      'providers'
    ])
  },
  // watch: {
  //   currentPage (newValue) {
  //     this.listConfig.filters.offset = (newValue - 1) * this.itemsPerPage
  //     this.fetchArticles()
  //   },
  //   type () {
  //     this.resetPagination()
  //     this.fetchArticles()
  //   },
  //   author () {
  //     this.resetPagination()
  //     this.fetchArticles()
  //   },
  //   tag () {
  //     this.resetPagination()
  //     this.fetchArticles()
  //   },
  //   favorited () {
  //     this.resetPagination()
  //     this.fetchArticles()
  //   }
  // },
  mounted () {
    this.fetchProviders()
  },
  methods: {
    fetchProviders () {
      this.$store.dispatch(FETCH_PROVIDERS)
    }
  //   resetPagination () {
  //     this.listConfig.offset = 0
  //     this.currentPage = 1
  //   }
  }
}
*/




</script> 


