<template>
  <b-card :header="caption">
    <b-table
      :hover="hover" 
      :striped="striped" 
      :bordered="bordered" 
      :small="small" 
      :fixed="fixed"      
      :items="items" 
      :fields="fields" 
      :current-page="currentPage" 
      :per-page="perPage"
      responsive="sm">
    <template slot="Acciones" slot-scope="data">
      <b-button variant="primary">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button :small="small" :href="ok">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button :small="small" :href="ok">
        <i class="fa fa-pencil"></i>
      </b-button>
    </template>
    </b-table>
    <nav>
      <b-pagination 
        :total-rows="getRowCount(items)" 
        :per-page="perPage" 
        v-model="currentPage" 
        prev-text="Anterior" 
        next-text="Siguiente" 
        hide-goto-end-buttons />
    </nav>
  </b-card>
</template>

<script>
/**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export default {
  name: 'clientTable',
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
      items: shuffleArray([
        {Nombre: 'Samppa Nori',
        Código: '4585',
        CUIT: '30-70094095-7',
        CondiciónIVA: 'Responsable Inscripto',
        Teléfono: '43392800',
        Dirección: 'Saenz Peña Luis Pte. 1351',
        Email: 'axdiaz@ups.com',
        Provincia: 'Buenos Aires',
        Acciones: ''}
      ]),
      fields: [
        {key: 'Nombre'},
        {key: 'Código'},
        {key: 'CUIT'},
        {key: 'CondiciónIVA'},
        {key: 'Teléfono'},
        {key: 'Dirección'},
        {key: 'Email'},
        {key: 'Provincia'},
        {key: 'Acciones'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0
    }
  },
  methods: {
    getRowCount (items) {
      return items.length
    }
  }
}
</script>
