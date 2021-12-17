<template>
  <div>
    Hello dear <b style="color: red">{{ getUserInfo.email }}</b> you're in
    profile page
    <hr />
    This is your information:
    <br /><br />
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Scope</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ getUserInfo.id }}</td>
          <td>{{ getUserInfo.scope }}</td>
          <td>{{ getUserInfo.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  computed: {
    getUserInfo() {
      return this.$auth.user
    },
  },
}
</script>
