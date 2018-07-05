<template>
  <b-card :header="caption">
    <template>
      <b-row class="actions-bar">
        <b-col sm="6">
          <b-button :to="{ name: 'Nuevo Proveedor' }" variant="primary">
            Nuevo proveedor
          </b-button>
          <b-button v-b-modal.modal-center variant="outline-danger">Eliminar</b-button>
          <b-button disabled variant="outline-primary" >Importar</b-button>
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
        <router-link tag="b-button" class="btn-primary" variant="btn-primary" :to="{ name: 'Editar Proveedor', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i>
        </router-link>
        <router-link tag="b-button" :small="small" :to="{ name: 'Nuevo Envío' }">
          <i class="fa fa-plane"></i>
        </router-link>
        <router-link tag="b-button" class="btn-danger" to="charts" :small="small">
          <i class="fa fa-trash"></i>
        </router-link>
      </template>
    </b-table>
    <nav>
    <b-modal id="modal-center" ref="deleteModal" hide-footer centered title="Confirmación">
    <p class="my-2 mb-4 text-center">¿Desea eliminar definitivamente el registro seleccionado?</p>
    <b-row>
      <b-col sm="12 text-center" slot="modal-footer">
        <b-button variant="primary" @click="hideModal">No, volveré atrás</b-button>
        <b-button variant="danger">Sí, deseo eliminarlo</b-button>
      </b-col>
    </b-row>
  </b-modal>
      <b-pagination :total-rows="providersCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
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
    },
    hideModal () {
      this.$refs.deleteModal.hide()
    }
  }
}
</script>
