<template>
  <div>
    <b-row class="actions-bar">
      <b-col sm="6">
        <b-button variant="primary" :to="{ name: 'Nuevo Usuario' }"><i class="fa fa-plus-circle ml-1"></i> Nuevo usuario</b-button>
      </b-col>
    </b-row>
    <b-card :header="caption" v-if="users.length === 0">
      No hay usuarios cargados. Crear un <b-link :to="{ name: 'Nuevo Usuario' }">nuevo usuario</b-link>.
    </b-card>
  <b-card :header="caption" v-else>
    <template>
      <b-row class="actions-bar">
        <b-col sm="8">
          <b-dropdown class="mx-1" variant="danger" text="Acciones en lote">
            <b-dropdown-item @click="showDeleteModal()" v-b-modal.modal-center>Eliminar seleccionados</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <b-col sm="4">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </template>
    <!-- tabla -->
    <b-table class="list-table" :hover="true" :striped="true" :bordered="true" :small="false" :fixed="true" :items="users" :fields="fields"
      :current-page="currentPage" :per-page="perPage" :filter="filter" responsive="sm" v-model="tableValues" @head-clicked="clearSelected">

      <template slot="HEAD_selection" slot-scope="head">
        <input type="checkbox" @click.stop="toggleSelected" v-model="allSelected" />
      </template>

      <template slot="selection" slot-scope="data">
        <input type="checkbox" name="checked" :key="data.index" :value="data.item" @click.stop v-model="checkedItems" />
      </template>
      <template slot="name" slot-scope="data">
        <b-button variant="link" :to="{ name: 'Editar Usuario', params: { id: data.item.objectId } }">
          {{ data.item.name }}
        </b-button>
      </template>

      <template slot="actions" slot-scope="data">
        <b-button variant="primary" size="sm" :to="{ name: 'Editar Usuario', params: { id: data.item.objectId } }">
          <i class="fa fa-pencil"></i> Editar
        </b-button>
      </template>
    </b-table>
    <!-- end tabla -->
    <nav>
      <b-pagination :total-rows="usersCount" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente"
        hide-goto-end-buttons @click.native="clearSelected" />
    </nav>
  </b-card>
  <c-confirmation-modal
  classModal="delete-modal"
  ref="deleteModal"
  :modalTitle="'¿Está seguro que desea eliminar ' +  (deleteMultiple && checkedItems.length > 1 ? 'los registros seleccionados' : 'este registro') + '?'"
  :promptMessage="'Se ' + (deleteMultiple && checkedItems.length > 1 ? `eliminarán los ${checkedItems.length} registros seleccionados` : 'eliminará el registro seleccionado') + ' de la lista de usuarios. Esta acción no se puede deshacer'"
  :confirmationMessage="'Sí, ' + (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' eliminaré'"
  :cancellationMessage="'No, ' +  (deleteMultiple && checkedItems.length > 1 ? 'los' : 'lo') + ' conservaré '  "
  confirmationMethod="confirmDelete"
  cancellationMethod="cancelDelete"
  @confirmDelete="confirmDelete"
  @cancelDelete="hideDeleteModal"></c-confirmation-modal>
  <!-- <pre>{{ JSON.stringify(users, null, 2) }}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_USERS, USER_DELETE } from '@/store/types/actions'
import CConfirmationModal from '@/components/ConfirmationModal'

export default {
  name: 'c-user-list',
  components: { CConfirmationModal },
  props: { caption: { type: String, default: 'Usuarios' } },
  data: () => {
    return {
      fields: [ { key: 'selection', class: 'selection' },
        { key: 'username', label: 'Nombre', sortable: true, editable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role.name', label: 'Rol', sortable: true },
        // { key: 'docValue', label: 'CUIT / Nº doc.', sortable: true },
        // { key: 'taxCategory', label: 'CondiciónIVA' },
        // { key: 'phone', label: 'Teléfono' },
        // { key: 'address.streetAddress', label: 'Dirección' },
        // { key: 'email', label: 'Email', sortable: true },
        // { key: 'province', label: 'Provincia' },
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
    ...mapGetters([ 'usersCount', 'userLoading', 'users' ])
  },
  mounted () {
    this.fetchUsers()
  },
  watch: {
    checkedItems (a, b) {
      this.allSelected = (this.tableValues.length === a.length)
    }
  },
  methods: {
    fetchUsers () {
      this.$store.dispatch(FETCH_USERS)
    },
    showDeleteModal (id) {
      if (id) {
        this.clearSelected()
        this.deleteId = id
        this.deleteMultiple = false
        this.$refs.deleteModal.$refs.confirmationModal.show()
      } else if (this.checkedItems.length > 0) {
        // si no hay id y no hay checkboxes seleccionados, ni muestro el modal
        this.deleteMultiple = true
        this.$refs.deleteModal.$refs.confirmationModal.show()
      } else {
        this.$toasted.global.error_toast({ message: 'No hay filas seleccionadas' })
      }
    },
    hideDeleteModal () {
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    confirmDelete () {
      let promises = []
      if (this.deleteMultiple) {
        for (let i = 0, len = this.checkedItems.length; i < len; i++) {
          promises.push(
            this.$store.dispatch(USER_DELETE, this.checkedItems[i].objectId)
          )
        }
        Promise.all(promises).then(() => {
          this.$toasted.global.success_toast({ message: `${this.checkedItems.length} registros eliminados con éxito` })
          this.fetchUsers()
          this.clearSelected()
        }, error => {
          this.$toasted.global.error_toast({ message: error })
        })
      } else {
        this.$store
          .dispatch(USER_DELETE, this.deleteId)
          .then(res => {
            this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
            this.fetchUsers()
            this.clearSelected()
          }, error => {
            this.$toasted.global.error_toast({ message: error })
          })
      }
      this.$refs.deleteModal.$refs.confirmationModal.hide()
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
