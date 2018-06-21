<template v-show="errors">
  <ul class="error-messages">
    <li v-for="(value, key) in errors" :key="key">
    {{key}}
    <span v-for="(err, key) in value" :key="key">{{err}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'c-list-errors',
  props: {
    errors: { type: Object, required: true }
  }
}
</script>
