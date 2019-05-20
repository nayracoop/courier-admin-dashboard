<template>
  <div>
    <p>{{ bodyMessage }}</p>
    <b-form-file class="mt-4" :disabled="inProgress" @input="processCsv" id="fileDialog" ref="fileDialog" v-model="file" :state="Boolean(file)" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
    </b-form-file>
    <span class="label-file">Haga click aquí para adjuntar su archivo</span>
    <div class="modal-footer pb-0 mt-4" slot="modal-footer">
        <b-button variant="secondary" @click="onCancel" :disabled="inProgress">{{ cancellationMessage }}</b-button>
        <b-button variant="primary" @click="onConfirm" :disabled="count === 0 || inProgress">{{ buttonText }} <i v-show="inProgress" class="fa fa-cog fa-spin ml-1"></i></b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { countries, zipCodes, shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import Papa from 'papaparse'

export default {
  name: 'c-csv-file-dialog',
  data () {
    return {
      file: null,
      parsedFile: '',
      count: 0,
      inProgress: false,
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones
    }
  },
  props: {
    /*
    classModal: { type: String, default: 'default-modal' },
    cancellationMethod: { type: String, default: 'cancel' },
    provider: null,
    bodyMessage: { type: String },
    cancellationMessage: { type: String, default: 'Cancelar' } */
    cancellationMethod: { type: String, default: 'cancel' },
    cancellationMessage: { type: String },
    bodyMessage: { type: String },
    target: { type: String, default: 'provider' }
  },
  computed: {
    ...mapGetters(['provider', 'client']),
    buttonText () {
      return `Importar ${this.count} registros`
    }
  },
  methods: {
    processCsv () {
      var $this = this
      if ($this.file) {
        Papa.parse($this.file, {
          header: true,
          dynamicTyping: true,
          complete: function (results) {
            $this.count = results.data.length
            $this.parsedFile = results
          }
        })
      }
    },
    onConfirm () {
      switch (this.target) {
        case 'provider':
          this.parseProviderCosts()
          break
        case 'client':
          this.parseClientDiscounts()
          break
        case 'shippingZones':
          this.parseShippingZones()
          break
        default:
          this.count = 0
          this.parsedFile = null
          this.$refs.fileDialog.reset()
          this.$emit(this.cancellationMethod)
          break
      }
    },
    onCancel () {
      this.count = 0
      this.parsedFile = null
      // this.$refs.fileDialog.reset()
      this.$refs.fileDialog.reset()
      this.$emit(this.cancellationMethod)
    },
    addShippingZone (placeCode, zone, shippingType) {
      let zonesTableIndex = -1
      let placeIndex = -1
      let isDomestic = shippingType === 3
      let newRow = isDomestic ? {
        id: placeCode,
        zone: zone
      } : {
        numericCode: placeCode,
        zone: zone
      }

      // por el formato del archivo tengo que buscar el índice
      // para cada tipo de envío y si no exisite, insertar el registro
      // completo
      if (this.provider.shippingZones) {
        this.provider.shippingZones.filter((zone, k) => {
          if (zone.shippingType === shippingType) {
            zonesTableIndex = k
            return true
          }
        })
      }

      if (zonesTableIndex === -1) {
        this.provider.shippingZones.push(isDomestic ? {
          shippingType: shippingType,
          zipCodes: []
        } : {
          shippingType: shippingType,
          countries: []
        })
      } else {
        this.provider.shippingZones[zonesTableIndex][isDomestic ? 'zipCodes' : 'countries'].filter(
          (place, l) => {
            if ((!isDomestic && place.numericCode === placeCode) || (isDomestic && place.id === placeCode)) {
              placeIndex = l
              return true
            }
          })

        if (placeIndex === -1) {
          this.provider.shippingZones[zonesTableIndex][isDomestic ? 'zipCodes' : 'countries'].push(newRow)
        } else {
          this.provider.shippingZones[zonesTableIndex][isDomestic ? 'zipCodes' : 'countries'][placeIndex] = newRow
        }
      }
    },
    parseShippingZones () {
      this.inProgress = true
      let data
      for (let i = 0, len = this.parsedFile.data.length; i < len; i++) {
        data = this.parsedFile.data[i]
        if (data.pais !== undefined) {
          let importZone = data['zona_importacion']
          let exportZone = data['zona_exportacion']
          let country = countries.find(country => country.alpha2Code === data.pais)
          if (country !== undefined) {
            this.addShippingZone(country.numericCode, importZone, 1)
            this.addShippingZone(country.numericCode, exportZone, 2)
          }
        }
        if (data.cp !== undefined) {
          let zone = data.zona
          let zipCode = zipCodes.find(zipCode => zipCode['cod_postal'] === String(data.cp))
          if (zipCode !== undefined) {
            this.addShippingZone(zipCode.id, zone, 3)
          }
        }
      }
      this.inProgress = false
      this.$refs.fileDialog.reset()
      this.parsedFile = null
      this.count = 0
      this.$toasted.global.success_toast({ message: `Importación exitosa.` })
      this.$emit(this.cancellationMethod)
    },
    parseProviderCosts () {
      this.inProgress = true
      let shippingType = -1 // importacion, exportacion, domestico
      let serviceType = -1 // domestico, economy, priority
      let packageType = -1 // caja, pack, sobre
      let weight = ''
      let data = null
      let costsTableIndex = -1
      let costIndex = -1
      let price = -1
      let discount = -1
      let newRow = null
      for (let i = 0, len = this.parsedFile.data.length; i < len; i++) {
        data = this.parsedFile.data[i]
        shippingType = this.shippingTypes.find(el => el.text === data.envio || el.normalized === data.envio) // data.envio === 'importacion' ? 1 : data.envio === 'exportacion' ? 2 : data.envio === 'domestico' ? 3 : -1
        serviceType = this.serviceTypes.find(el => el.text === data.servicio || el.normalized === data.servicio) // data.servicio === 'domestico' ? 1 : data.servicio === 'economy' ? 2 : data.servicio === 'priority' ? 3 : -1
        packageType = this.packageTypes.find(el => el.text === data.embalaje || el.normalized === data.embalaje) // data.embalaje === 'caja' ? 1 : data.embalaje === 'pack' ? 2 : data.embalaje === 'sobre' ? 3 : -1
        shippingType = shippingType !== undefined ? shippingType.value : -1
        serviceType = serviceType !== undefined ? serviceType.value : -1
        packageType = packageType !== undefined ? packageType.value : -1
        weight = data.peso

        for (let j = 1; j < 7; j++) {
          price = data['Zona ' + j]
          discount = data['Descuento Zona ' + j]
          newRow = {
            weight: weight,
            grossPrice: price,
            costDiscount: discount
            // saleDiscount: 0,
            // netPrice: price,
            // cost: price
          }
          // por el formato del archivo tengo que buscar el índice
          // para cada zona y si no exisite, insertar el registro
          // completo
          if (this.provider.costsTable) {
            this.provider.costsTable.filter(
              (cost, k) => {
                if (cost.shippingType === shippingType &&
                cost.serviceType === serviceType &&
                cost.packageType === packageType &&
                cost.shippingZone === j) {
                  costsTableIndex = k
                  return true
                }
              })
          }

          if (costsTableIndex === -1) {
            this.provider.costsTable.push({
              shippingType: shippingType,
              serviceType: serviceType,
              packageType: packageType,
              shippingZone: j,
              costs: [newRow]
            })
          } else {
            this.provider.costsTable[costsTableIndex].costs.filter(
              (cost, l) => {
                if (cost.weight === weight) {
                  costIndex = l
                  return true
                }
              })

            if (costIndex === -1) {
              this.provider.costsTable[costsTableIndex].costs.push(newRow)
            } else {
              this.provider.costsTable[costsTableIndex].costs[costIndex] = newRow
            }
          }

          costsTableIndex = -1
          costIndex = -1
          price = -1
          newRow = null
        }
      }
      this.inProgress = false
      this.$refs.fileDialog.reset()
      this.parsedFile = null
      this.count = 0
      this.$toasted.global.success_toast({ message: `Importación exitosa.` })
      this.$emit(this.cancellationMethod)
    },
    parseClientDiscounts () {
      this.inProgress = true
      let providerId = ''
      let shippingType = -1 // importacion, exportacion, domestico
      let serviceType = -1 // domestico, economy, priority
      let packageType = -1 // caja, pack, sobre
      let weight = ''
      let data = null
      let costsTableIndex = -1
      let costIndex = -1
      let discount = -1
      let newRow = null

      for (let i = 0, len = this.parsedFile.data.length; i < len; i++) {
        data = this.parsedFile.data[i]
        providerId = data.proveedor || ''
        shippingType = this.shippingTypes.find(el => el.text === data.envio || el.normalized === data.envio) // data.envio === 'importacion' ? 1 : data.envio === 'exportacion' ? 2 : data.envio === 'domestico' ? 3 : -1
        serviceType = this.serviceTypes.find(el => el.text === data.servicio || el.normalized === data.servicio) // data.servicio === 'domestico' ? 1 : data.servicio === 'economy' ? 2 : data.servicio === 'priority' ? 3 : -1
        packageType = this.packageTypes.find(el => el.text === data.embalaje || el.normalized === data.embalaje) // data.embalaje === 'caja' ? 1 : data.embalaje === 'pack' ? 2 : data.embalaje === 'sobre' ? 3 : -1
        shippingType = shippingType !== undefined ? shippingType.value : -1
        serviceType = serviceType !== undefined ? serviceType.value : -1
        packageType = packageType !== undefined ? packageType.value : -1
        weight = data.peso

        for (let j = 1; j < 7; j++) {
          discount = data['Zona ' + j]
          newRow = {
            weight: weight,
            saleDiscount: discount
          }
          // por el formato del archivo tengo que buscar el índice
          // para cada zona y si no exisite, insertar el registro
          // completo
          if (this.client.costsTable) {
            this.client.costsTable.filter(
              (cost, k) => {
                if (cost.providerId === providerId &&
                cost.shippingType === shippingType &&
                cost.serviceType === serviceType &&
                cost.packageType === packageType &&
                cost.shippingZone === j) {
                  costsTableIndex = k
                  return true
                }
              })
          }

          if (costsTableIndex === -1) {
            this.client.costsTable.push({
              providerId: providerId,
              shippingType: shippingType,
              serviceType: serviceType,
              packageType: packageType,
              shippingZone: j,
              costs: [newRow]
            })
          } else {
            this.client.costsTable[costsTableIndex].costs.filter(
              (cost, l) => {
                if (cost.weight === weight) {
                  costIndex = l
                  return true
                }
              })

            if (costIndex === -1) {
              this.client.costsTable[costsTableIndex].costs.push(newRow)
            } else {
              this.client.costsTable[costsTableIndex].costs[costIndex] = newRow
            }
          }

          costsTableIndex = -1
          costIndex = -1
          discount = -1
          newRow = null
        }
      }
      this.inProgress = false
      this.$refs.fileDialog.reset()
      this.parsedFile = null
      this.count = 0
      this.$toasted.global.success_toast({ message: `Importación exitosa.` })
      this.$emit(this.cancellationMethod)
    }
  }
}
</script>
