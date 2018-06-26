<template>
  <!-- componente lista de clientes -->
  <c-client-list />
</template>

<script>
import CClientList from '@/components/ClientList'

export default {
  name: 'v-clients',
  components: {
    CClientList
  }
}
</script>
