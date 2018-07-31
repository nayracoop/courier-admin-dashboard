<template>
  <div>
    <b-form-file @input="processCsv" id="fileDialog" ref="fileDialog" v-model="file" :state="Boolean(file)" accept="text/csv" placeholder="Seleccione un archivo..."></b-form-file>
    <pre>{{ JSON.stringify(parsedFile, null, 2) }}</pre>
  </div>
</template>

<script>
import Papa from 'papaparse'

export default {
  name: 'c-file-dialog',
  data () {
    return {
      file: null,
      parsedFile: ''
    }
  },
  methods: {
    processCsv () {
      var $this = this
      Papa.parse($this.file, {
        header: true,
        complete: function (results) {
          $this.parsedFile = results
        }
      })
    }
  }
}
</script>
