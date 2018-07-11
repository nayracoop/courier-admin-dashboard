<template>

  <div class="home-global">
    <c-provider-list type="all" caption="Proveedores" />
  </div>

</template>
<script>
import CProviderList from '@/components/ProviderList'

export default {
  name: 'v-providers',
  components: {
    CProviderList
  }
}
</script>
