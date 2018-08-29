<template>
  <div>
    <p>{{ bodyMessage }}</p>
    <b-form-file class="mt-4" :disabled="inProgress" @input="processCsv" id="fileDialog" ref="fileDialog" v-model="file" :state="Boolean(file)" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" placeholder="Seleccione un archivo..."></b-form-file>
    <div class="modal-footer pb-0 mt-4" slot="modal-footer">
        <b-button variant="secondary" @click="onCancel" :disabled="inProgress">{{ cancellationMessage }}</b-button>
        <b-button variant="primary" @click="onConfirm" :disabled="count === 0 || inProgress">{{ buttonText }} <i v-show="inProgress" class="fa fa-cog fa-spin ml-1"></i></b-button>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse'

export default {
  name: 'c-csv-file-dialog',
  data () {
    return {
      file: null,
      parsedFile: '',
      count: 0,
      inProgress: false

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
    provider: null
  },
  computed: {
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
      this.inProgress = true
      let shippingType = -1 // importacion, exportacion, domestico
      let serviceType = -1 // domestico, economy, priority
      let packageType = -1 // caja, pack, sobre
      let weight = ''
      let data = null
      let costsTableIndex = -1
      let costIndex = -1
      let price = -1
      let newRow = null
      for (let i = 0, len = this.parsedFile.data.length; i < len; i++) {
        data = this.parsedFile.data[i]
        shippingType = data.envio === 'importacion' ? 1 : data.envio === 'exportacion' ? 2 : data.envio === 'domestico' ? 3 : -1
        serviceType = data.servicio === 'domestico' ? 1 : data.servicio === 'economy' ? 2 : data.servicio === 'priority' ? 3 : -1
        packageType = data.embalaje === 'caja' ? 1 : data.embalaje === 'pack' ? 2 : data.embalaje === 'sobre' ? 3 : -1
        weight = data.peso

        for (let j = 1; j < 7; j++) {
          price = data['Zona ' + j]
          newRow = {
            weight: weight,
            grossPrice: price,
            saleDiscount: 0,
            netPrice: price,
            costDiscount: 0,
            cost: price
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
    onCancel () {
      this.count = 0
      this.parsedFile = null
      // this.$refs.fileDialog.reset()
      this.$refs.fileDialog.reset()
      this.$emit(this.cancellationMethod)
    }
  }
}
</script>
