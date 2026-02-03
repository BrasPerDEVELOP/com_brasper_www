import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ClientLayout from '@/interface/layout/ClientLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'homepage',
    component: () => import('@/modules/home/presentation/bodies/HomepageView.vue'),
    meta: { public: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/modules/auth/presentation/bodies/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/modules/user/presentation/bodies/RegisterView.vue'),
    meta: { public: true }
  },
  {
    path: '/dashboard',
    component: ClientLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/modules/home/presentation/bodies/HomeView.vue')
      },
      {
        path: 'home/user',
        redirect: { name: 'step', params: { stepId: '1' } }
      },
      {
        path: 'step/:stepId',
        name: 'step',
        component: () => import('@/modules/transfer/presentation/bodies/StepView.vue')
      },
      {
        path: 'accounts',
        name: 'accounts',
        component: () => import('@/modules/accounts/presentation/bodies/MyAccountsView.vue')
      },
      {
        path: 'accounts/personal',
        name: 'accounts-personal',
        component: () => import('@/modules/accounts/presentation/bodies/AccountsPersonView.vue')
      },
      {
        path: 'account-peru',
        name: 'account-peru',
        component: () => import('@/modules/accounts/presentation/bodies/BankAccountPeruView.vue')
      },
      {
        path: 'account-brasil',
        name: 'account-brasil',
        component: () => import('@/modules/accounts/presentation/bodies/BankAccountBrasilView.vue')
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('@/modules/transactions/presentation/bodies/TransactionListView.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/modules/auth/presentation/bodies/ProfileView.vue')
      },
      {
        path: 'confirmacion',
        name: 'confirmacion',
        component: () => import('@/modules/transfer/presentation/bodies/ConfirmationView.vue')
      },
      {
        path: 'calculator',
        name: 'calculator',
        component: () => import('@/modules/calculator/presentation/bodies/CalculatorView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const TOKEN_KEY = 'token'

// Guard: rutas públicas (/, /auth, /register) libres; todo lo bajo /dashboard requiere auth.
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const isPublic = to.meta.public === true

  if (!requiresAuth || isPublic) {
    next()
    return
  }

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    next({ path: '/auth', query: { redirect: to.fullPath } })
    return
  }

  try {
    const { useAuthStore } = await import('@/modules/auth/presentation/controllers/useAuthStore')
    const authStore = useAuthStore()
    if (!authStore.user) {
      authStore.restoreUser()
    }
  } catch {
    // Si Pinia no está listo, seguir
  }

  next()
})

export default router
