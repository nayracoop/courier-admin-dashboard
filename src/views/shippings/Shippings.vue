<template>

  <div class="home-global">
    <c-shipping-list type="all" />
  </div>

</template>
<script>
import CShippingList from '@/components/ShippingList'

export default {
  name: 'v-shippings',
  components: {
    CShippingList
  }
}
</script>
