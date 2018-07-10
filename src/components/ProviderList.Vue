<template>
  <b-card :header="caption">
    <template>
      <b-row class="actions-bar">
        <b-col sm="6">
          <b-button :to="{ name: 'Nuevo Proveedor' }" variant="primary">
            Nuevo proveedor
          </b-button>
          <b-button @click="showing=true" v-b-modal.modal-center variant="outline-danger">Eliminar</b-button>
          <b-button disabled variant="outline-primary">Importar</b-button>
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
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" :items="providers" :fields="fields"
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm">
      <template slot="Acciones" slot-scope="data">
        <b-button variant="primary" :to="{ name: 'Editar Proveedor', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button :small="small" :to="{ name: 'Nuevo Envío' }">
          <i class="fa fa-plane"></i>
        </b-button>
        <b-button class="btn-danger" to="charts" :small="small">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="providersCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
        hide-goto-end-buttons />
    </nav>
    <c-confirmation-modal @confirm="confirmDelete()" @cancel="hideModal()" :count="2" :showing="showing"></c-confirmation-modal>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_PROVIDERS } from '@/store/types/actions'
import CConfirmationModal from '@/components/DeleteConfirmation'

export default {
  name: 'c-provider-list',
  components: {
    CConfirmationModal
  },
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
      fields: [{
        key: 'name',
        label: 'Nombre',
        sortable: true,
        editable: true
      },
        /* {
          key: 'userCode',
          label: 'Código',
          sortable: true
        }, */
      {
        key: 'vatId',
        label: 'CUIT',
        sortable: true
      },
        /* {
          key: 'taxType',
          label: 'CondiciónIVA'
        }, */
      {
        key: 'phone',
        label: 'Teléfono'
      },
      {
        key: 'address',
        label: 'Dirección'
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true
      },
      {
        key: 'province',
        label: 'Provincia'
      },
      {
        key: 'Acciones'
      }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      filter: null,
      showing: false
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
    },
    hideModal () {
      this.showing = false
    },
    confirmDelete () {
      this.showing = false
      console.log('confirma la eliminación')
    }
  }
}
</script>
