<template>
  <div>
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
      <!-- <v-pagination
        :pages="pages"
        :currentPage.sync="currentPage"
      ></v-pagination> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
</script>
