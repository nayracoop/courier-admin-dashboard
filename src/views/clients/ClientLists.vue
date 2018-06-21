<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <c-table>

        </c-table>
      </b-col>
    </b-row>
  </div>

</template>

<script>
import clientTable from 'ClientList.vue'

export default {
  name: 'tables',
  components: {clientTable}
}
</script>
