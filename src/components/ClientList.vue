<template>
  <b-card :header="caption">
    <b-table
      :hover="hover"
      :striped="striped"
      :bordered="bordered"
      :small="small"
      :fixed="fixed"
      :items="clients"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      responsive="sm">
    <template slot="Acciones" slot-scope="data">
<<<<<<< HEAD
      <router-link tag="b-button" :variant="primary" class="btn-primary" :to="{ name: 'Client', params: { id: data.item.id } }">
=======
      <router-link tag="b-button" variant="primary" :to="{ name: 'Client', params: { id: data.item.objectId } }">
>>>>>>> b4c068d71c82dc576364bf6aa2baf7080c513c98
        <i class="fa fa-pencil"></i>
      </router-link>
      <router-link tag="b-button" :variant="primary" to="charts" :small="small">
        <i class="fa fa-pencil"></i>
      </router-link>
      <router-link tag="b-button" class="btn-danger" to="charts" :small="small">
        <i class="fa fa-trash"></i>
      </router-link>
    </template>
    </b-table>
    <nav>
      <b-pagination
        :total-rows="clientsCount"
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
import { FETCH_CLIENTS } from '@/store/types/actions'
export default {
  name: 'c-client-list',
  props: {
    caption: {
      type: String,
      default: 'Clientes'
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
      totalRows: 0
    }
  },
  computed: {
    ...mapGetters([
      'clientsCount',
      'isLoading',
      'clients'
    ])
  },
  mounted () {
    this.fetchClients()
  },
  methods: {
    fetchClients () {
      this.$store.dispatch(FETCH_CLIENTS)
    }
  }
}
</script>
