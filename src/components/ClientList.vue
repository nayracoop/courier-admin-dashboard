<template>
  <b-card :header="caption">
    <template>
      <b-row class="actions-bar">
        <b-col sm="6">
          <b-button variant="primary" :to="{ name: 'Nuevo Cliente' }">Nuevo cliente <i class="fa fa-plus-circle ml-1"></i></b-button>
          <b-button variant="outline-danger" @click="showModal()" v-b-modal.modal-center>Eliminar <i class="fa fa-trash ml-1"></i></b-button>
          <b-button variant="outline-primary" disabled>Importar <i class="fa fa-file ml-1"></i></b-button>
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
    <!-- tabla -->
    <b-table :hover="true" :striped="true" :bordered="true" :small="true" :fixed="true" :items="clients" :fields="fields"
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues" @head-clicked="clearSelected">

      <template slot="HEAD_selection" slot-scope="head">
        <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
      </template>

      <template slot="selection" slot-scope="data">
        <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
      </template>

      <template slot="actions" slot-scope="data">
        <b-button v-b-tooltip.hover title="Editar registro" variant="primary" :to="{ name: 'Editar Cliente', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button v-b-tooltip.hover title="Nuevo envío" :small="true" :to="{ name: 'Nuevo Envío' }">
          <i class="fa fa-plane"></i>
        </b-button>
        <b-button v-b-tooltip.hover title="Eliminar registro" class="btn-danger" :small="true" @click="showModal(data.item.objectId)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <!-- end tabla -->
    <nav>
      <b-pagination :total-rows="clientsCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
        hide-goto-end-buttons @click.native="clearSelected" />
    </nav>
    <c-confirmation-modal @confirm="confirmDelete()" @cancel="hideModal()" :count="checkedItems.length" ref="confirmationModal" />
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CLIENTS, IMPORT_CLIENTS, CLIENT_DELETE } from '@/store/types/actions'
import CConfirmationModal from '@/components/DeleteConfirmation'

export default {
  name: 'c-client-list',
  components: {
    CConfirmationModal
  },
  props: { caption: { type: String, default: 'Clientes' } },
  data: () => {
    return {
      fields: [ 'selection',
        { key: 'name', label: 'Nombre', sortable: true, editable: true },
        // { key: 'userCode', label: 'Código', sortable: true },
        { key: 'taxId', label: 'CUIT', sortable: true },
        // { key: 'taxType', label: 'CondiciónIVA' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'address', label: 'Dirección' },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'province', label: 'Provincia' },
        { key: 'actions', label: 'Acciones' }
      ],
      allSelected: false,
      checkedItems: [],
      tableValues: [],
      deleteId: -1,
      deleteMultiple: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      filter: null
    }
  },
  computed: {
    ...mapGetters([ 'clientsCount', 'isLoading', 'clients' ])
  },
  mounted () {
    this.fetchClients()
  },
  watch: {
    checkedItems (a, b) {
      this.allSelected = (this.tableValues.length === a.length)
    }
  },
  methods: {
    fetchClients () {
      this.$store.dispatch(FETCH_CLIENTS)
    },
    importClients () {
      this.$store.dispatch(IMPORT_CLIENTS)
    },
    showModal (id) {
      if (id) {
        this.deleteId = id
        this.deleteMultiple = false
        this.$refs.confirmationModal.$refs.deleteModal.show()
      } else if (this.checkedItems.length > 0) {
        // si no hay id y no hay checkboxes seleccionados, ni muestro el modal
        this.deleteMultiple = true
        this.$refs.confirmationModal.$refs.deleteModal.show()
      }
    },
    hideModal () {
      this.$refs.confirmationModal.$refs.deleteModal.hide()
    },
    confirmDelete () {
      var promises = []
      if (this.deleteMultiple) {
        for (var i = 0, len = this.checkedItems.length; i < len; i++) {
          promises.push(
            this.$store.dispatch(CLIENT_DELETE, this.checkedItems[i].objectId)
          )
        }
        Promise.all(promises).then(() => {
          this.fetchClients()
          this.clearSelected()
        })
      } else {
        this.$store
          .dispatch(CLIENT_DELETE, this.deleteId)
          .then(res => {
            this.fetchClients()
            this.clearSelected()
          }, error => {
            console.log(error)
          })
      }
      this.$refs.confirmationModal.$refs.deleteModal.hide()
    },
    toggleSelected () {
      this.allSelected = !this.allSelected
      this.checkedItems = this.allSelected ? this.tableValues : []
    },
    clearSelected () {
      this.allSelected = false
      this.checkedItems = []
    }
  }
}
</script>
