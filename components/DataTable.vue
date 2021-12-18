<template>
  <div>
    <v-data-table
      class="row-pointer"
      :headers="headers"
      :items="items"
      :loading="loading"
      loading-text="Data is loading..."
      disable-pagination
      hide-default-footer
      @click:row="atRowClick"
    >
      <template v-for="col in formattedCols" #[`item.${col}`]="{ item }">
        <slot :name="col" :item="item" />
      </template>
      <template #no-data>
        <slot name="no-results">
          <v-alert type="info">No results were found...</v-alert>
        </slot>
      </template>
    </v-data-table>
    <v-pagination
      v-if="!loading && numberOfPages > 1"
      v-model="pagination.page"
      :length="numberOfPages"
      :total-visible="5"
      @input="setItems()"
    >
    </v-pagination>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    getItems: {
      type: Function,
      required: true,
    },
    itemsTotal: {
      type: Number,
      required: true,
    },
    filters: {
      type: Array,
      default: null,
      required: false,
    },
    // Columns with special formatting like adding a status button before the actual label
    formattedCols: {
      type: Array,
      default: () => {
        return []
      },
      required: false,
    },
    rowsPerPage: {
      type: Number,
      default: 20,
      required: false,
    },
    atRowClick: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      items: [],
      loading: false,
      pagination: { page: 1, rowsPerPage: this.rowsPerPage },
    }
  },
  computed: {
    numberOfPages(): number {
      return Math.ceil(this.itemsTotal / this.pagination.rowsPerPage)
    },
  },
  watch: {
    // When parent filters change, update the datatable
    filters() {
      this.setItems()
    },
  },
  mounted() {
    this.setItems()
  },
  methods: {
    async setItems(): Promise<void> {
      this.loading = true
      const result = await this.getItems(this.pagination)
      if (result) {
        this.items = result
        this.loading = false
      }
    },
  },
}
</script>
<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
