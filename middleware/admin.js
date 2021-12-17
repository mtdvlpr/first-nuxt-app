export default function ({ $auth, redirect }) {
  const user = $auth.user
  if (!user.user && !user.user.scope.includes('admin')) {
    redirect('/')
  }
}
