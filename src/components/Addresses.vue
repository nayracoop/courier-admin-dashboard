<template>
  <div>
    <b-row>
      <b-col v-if="deletedAddress !== null" sm="12">
        <b-alert show variant="warning" dismissible>La dirección "{{ deletedAddress[0].alias }}" será eliminada. <a href="#" @click.prevent="restoreAddress"><b>Deshacer</b></a></b-alert>
      </b-col>
      <b-col v-if="addressList.length > 1" sm="12">
        <b-form-group>
          <label :for="id + '_myAddresses'">Direcciones guardadas</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-select :id="id + '_myAddresses'" :plain="true" :options="addressList" v-model="selAddressId" @input="changeAddress" />
        </b-form-group>
        <div class="address-card" v-show="!isNew && !editMode">
            <p>
              <b v-if="currentAddress.address.contactName">{{ currentAddress.address.contactName }}</b>
              <span v-if="currentAddress.address.name"> - <i>{{ currentAddress.address.name }}</i></span>
              <br>
              <span>{{ currentAddress.address.streetAddress }}<br></span>
              <span v-if="currentAddress.address.floor || currentAddress.address.apartment">{{ currentAddress.address.floor }}º{{ currentAddress.address.apartment }}<br></span>
              <span>{{ currentAddress.address.city }}, {{ currentAddress.address.state }} {{ currentAddress.address.postalCode }}<br></span>
              <span v-if="selectedCountry">{{ selectedCountry.name }}</span>
              <!-- <br>
              <span v-for="(direccion, key) in currentAddress">{{ key }}: {{ direccion }}<br></span> -->
            </p>
            <p v-if="currentAddress.isDefault"><i class="fa fa-check"></i> Dirección predeterminada</p>
            <!-- <br>
            <br> -->
            <!-- <b-link @click.prevent="toggleEditMode"  v-if="!edit">Editar dirección <i class="fa fa-pencil"></i></b-link> -->
            <b-button size="sm" variant="primary" @click.prevent="toggleEditMode" v-if="!editMode"><i class="fa fa-pencil"></i> Editar dirección</b-button>
            <b-button size="sm" variant="danger" @click.prevent="deleteAddress" v-if="!editMode"><i class="fa fa-trash-o"></i> Eliminar</b-button>
            <b-button size="sm" variant="outline-primary" @click.prevent="convertToDefault" v-if="!editMode && !currentAddress.isDefault"><i class="fa fa-map-marker"></i> Convertir en principal</b-button>
        </div>
      </b-col>
      <b-col sm="12" v-else-if="this.client.objectId !== undefined && this.client.objectId !== ''">
        <b-alert show variant="info">Este cliente no posee direcciones de envío guardadas</b-alert>
      </b-col>
    </b-row>
    <b-form-group v-if="isNew || editMode">
      <b-alert show variant="warning" v-if="editMode" dismissible>Para guardar los cambios en esta dirección haga click en <b><a href="#" @click.prevent="updateClientAddress">Aplicar</a></b></b-alert>
      <c-address-form ref="addressForm" v-model="currentAddress" :id="id" :savable="saveAddress"></c-address-form>
      <div v-if="editMode">
        <b-button size="sm" variant="primary" @click.prevent="updateClientAddress" v-if="editMode"><i class="fa fa-dot-circle-o"></i> Aplicar</b-button>
        <b-button size="sm" variant="danger" @click.prevent="toggleEditMode" v-if="editMode"><i class="fa fa-ban"></i> Cancelar</b-button>
      </div>
      <b-row v-show="isShipping && !editMode">
        <b-col sm="12">
          <b-form-group>
            <b-check :id="id + '_saveAddress'" v-model="saveAddress">Recordar esta dirección para futuros envíos</b-check>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form-group>
    <!-- <pre>{{ JSON.stringify(currentAddress, null, 4) }}</pre>
    <pre>{{ JSON.stringify(client.addresses, null, 4) }}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import store from '@/store'
import { countries, argProvinces } from '@/store/const'

import CAddressForm from '@/components/AddressForm'
// import { CLIENT_EDIT } from '@/store/types/actions'
// import { crudMixin } from '@/mixins/crudMixin'

export default {
  name: 'c-addresses',
  components: {
    CAddressForm
  },
  props: {
    isShipping: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      saveAddress: true,
      selAddressId: -1,
      addressList: [],
      countryIsoList: [],
      countryList: [],
      argProvinceList: [],
      editMode: false,
      currentAddress: this.getEmptyAddress(),
      // warningMessage: '',
      deletedAddress: null,
      id: null
    }
  },
  // watch: {
  //   currentAddress () {
  //     console.log("sdfdasf")
  //     // this.warningMessage = ''
  //     if (this.editMode) this.warningMessage = 'Importante: Hay cambios sin guardar'
  //   }
  // },
  created () {
    this.id = this._uid

    // cargo la lista de direcciones
    this.$eventHub.$on('saveSuccess', this.saveSuccess)
    this.$eventHub.$on('refreshAddresses', this.setAddressList)
    this.setAddressList()
    // cargo las listas de país ISO y nombre
    countries.map(el => {
      this.countryIsoList.push({ value: el.numericCode, text: el.alpha2Code })
      this.countryList.push({ value: el.numericCode, text: el.name })
    })
    argProvinces.map(el => {
      this.argProvinceList.push({ value: el.provincia_id, text: el.provincia_nombre })
    })
  },
  beforeDestroy () {
    this.$eventHub.$off('saveSuccess', this.saveSuccess)
    this.$eventHub.$off('refreshAddresses', this.setAddressList)
  },
  computed: {
    ...mapGetters(['client']),
    isNew () {
      return this.selAddressId === -1
    },
    selectedCountry () {
      if (this.currentAddress && this.currentAddress.address) {
        return countries.find(el => {
          return el.numericCode === this.currentAddress.address.country
        })
      }
      return countries.find(el => {
        return el.numericCode === '042'
      })
    }
  },
  methods: {
    changeAddress () {
      this.editMode = false
      if (this.isNew) {
        let newIndex = this.client.addresses.length
        // valido que la posición anterior no esté vacía
        let hasName = this.client.addresses[newIndex - 1].name !== ''
        let hasAlias = this.client.addresses[newIndex - 1].alias !== ''
        if (!hasName && !hasAlias) {
          --newIndex
        }
        this.currentAddress = this.getEmptyAddress()
        this.client.addresses[newIndex] = this.currentAddress
        this.$emit('saved-address-updated', true)
      } else {
        this.currentAddress = this.client.addresses[this.selAddressId]
        this.$emit('saved-address-updated', false)
        // this.fillAddress()
      }
    },
    toggleEditMode (toastMessage) {
      if (this.editMode) {
        (typeof toastMessage === 'string') ? this.$toasted.global.success_toast({ message: toastMessage }) : this.$toasted.global.error_toast({ message: 'No se aplicaron los cambios en la dirección' })
      }
      this.editMode = !this.editMode
      this.currentAddress = this.editMode ? this.getAddressCopy() : this.client.addresses[this.selAddressId]
      // this.warningMessage = ''
    },
    getAddressCopy () {
      return Object.assign({}, this.client.addresses[this.selAddressId])
    },
    getEmptyAddress () {
      return {
        address: {
          country: '',
          name: '',
          contactName: '',
          streetAddress: '',
          floor: '',
          apartment: '',
          postalCode: '',
          state: '',
          province: '',
          city: '',
          isResidential: false,
          email: '',
          phone: '',
          comments: ''
        },
        alias: '',
        isDefault: false
      }
    },
    updateClientAddress () {
      if (this.currentAddress.isDefault) this.convertToDefault()
      this.client.addresses[this.selAddressId] = Object.assign({}, this.currentAddress)

      // this.$toasted.global.success_toast({ message: 'Se aplicaron los cambios en la dirección' })

      this.$emit('saved-address-updated', true)
      this.toggleEditMode('Se aplicaron los cambios en la dirección')
      // this.save(this.client, CLIENT_EDIT, 'Editar Cliente')
    },
    setAddressList () {
      this.$emit('saved-address-updated', false)

      let addressList = []
      this.editMode = false
      if (this.client.addresses.length) {
        // si está recargando la página no quiero volver a meter un registro
        // evaluo la primer posición a ver si está vacía
        let text = ''
        let hasName = this.client.addresses[0].address.name !== ''
        let hasAlias = this.client.addresses[0].alias !== ''

        if (hasName || hasAlias) {
          this.client.addresses.map((el, index) => {
            if (el.alias === undefined || el.alias === '' || el.alias === null) {
              text = el.address.name
            } else {
              text = el.alias
            }

            if (el.isDefault || index === 0) {
              this.selAddressId = index
              this.currentAddress = this.client.addresses[index]
            }
            if (el.alias !== '' || el.address.name !== '') {
              addressList.push({ value: index, text: text })
            }
          })
        } else {
          // la lista está vacía
          this.client.addresses[0] = this.currentAddress = this.getEmptyAddress()
          this.selAddressId = -1
        }
      } else {
        // la lista está vacía
        this.client.addresses[0] = this.currentAddress = this.getEmptyAddress()
        this.selAddressId = -1
      }
      addressList.push({ value: -1, text: 'Cargar una nueva dirección...' })
      this.addressList = addressList
    },
    updateStateText (value) {
      this.currentAddress.address.state = this.argProvinceList.find((prov) => {
        return prov.value === value
      }).text
    },
    saveSuccess (savedObject) {
      this.setAddressList()
    },
    changeDefault (checked) {
      if (this.client.addresses.length && checked) {
        for (let i = 0; i < this.client.addresses.length; i++) {
          if (i !== this.selAddressId) {
            this.client.addresses[i].isDefault = false
          }
        }
      }
    },
    deleteAddress () {
      this.deletedAddress = this.client.addresses.splice(this.selAddressId, 1)
      this.$toasted.global.success_toast({ message: 'La dirección ' + this.deletedAddress[0].alias + ' se eliminará cuando guarde los cambios.' })
      this.setAddressList()
    },
    restoreAddress () {
      this.$toasted.global.success_toast({ message: 'La dirección se ha restaurado' })
      this.client.addresses.unshift(this.deletedAddress[0])
      this.deletedAddress = null
      this.setAddressList()
    },
    convertToDefault () {
      this.client.addresses.forEach(address => {
        address.isDefault = false
      })
      this.client.addresses[this.selAddressId].isDefault = true
    },
    validate () {
      return (this.isNew) ? this.$refs.addressForm.validate() : this.$validator.validateAll()
    }
  },
  watch: {
    currentAddress: {
      handler (value) {
        // console.log(value)
        this.$emit('address-updated', value.address)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .alert a {
    color:inherit;
    text-decoration: underline;
  }
</style>
