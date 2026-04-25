import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ClientLayout from '@/interface/layout/ClientLayout.vue'
import { i18n } from '@/interface/presentation/i18n'
import {
  appLocaleToRouteLocale,
  getPreferredRouteLocale,
  isRouteLocale,
  routeLocaleToAppLocale,
  type RouteLocale
} from '@/interface/presentation/i18n/locales'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => ({ name: 'homepage', params: { locale: getPreferredRouteLocale() } })
  },
  {
    path: '/:locale(es|en|pr)',
    name: 'homepage',
    component: () => import('@/modules/home/presentation/bodies/HomepageView.vue'),
    meta: { public: true, localized: true }
  },
  {
    path: '/:locale(es|en|pr)/blog',
    name: 'blog-list',
    component: () => import('@/modules/blog/presentation/bodies/BlogListView.vue'),
    meta: { public: true, localized: true }
  },
  {
    path: '/:locale(es|en|pr)/blog/:slug',
    name: 'blog-detail',
    component: () => import('@/modules/blog/presentation/bodies/BlogDetailView.vue'),
    meta: { public: true, localized: true }
  },
  {
    path: '/:locale(es|en|pr)/faq',
    name: 'faq',
    component: () => import('@/modules/home/presentation/bodies/FaqView.vue'),
    meta: { public: true, localized: true }
  },
  {
    path: '/:locale(es|en|pr)/auth',
    name: 'auth',
    component: () => import('@/modules/auth/presentation/bodies/LoginView.vue'),
    meta: { public: true, localized: true, robots: 'noindex,follow' }
  },
  {
    path: '/:locale(es|en|pr)/register',
    name: 'register',
    component: () => import('@/modules/user/presentation/bodies/RegisterView.vue'),
    meta: { public: true, localized: true, robots: 'noindex,follow' }
  },
  {
    path: '/dashboard',
    component: ClientLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/modules/home/presentation/bodies/HomepageView.vue')
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
      },
      {
        path: 'tasas',
        name: 'tasas',
        component: () => import('@/modules/tasas/presentation/bodies/TasasView.vue')
      },
      {
        path: 'comisiones',
        name: 'comisiones',
        component: () => import('@/modules/comisiones/presentation/bodies/ComisionesView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 88
      }
    }

    return { top: 0 }
  }
})

const TOKEN_KEY = 'token'

// Guard: rutas públicas (/, /auth, /register) libres; todo lo bajo /dashboard requiere auth.
router.beforeEach(async (to, _from, next) => {
  const targetLocale = isRouteLocale(to.params.locale)
    ? (to.params.locale as RouteLocale)
    : undefined

  if (to.meta.localized === true && !targetLocale && to.name) {
    next({
      name: String(to.name),
      params: {
        ...to.params,
        locale: getPreferredRouteLocale()
      },
      query: to.query,
      hash: to.hash,
      replace: true
    })
    return
  }

  if (targetLocale) {
    const appLocale = routeLocaleToAppLocale(targetLocale)
    i18n.global.locale.value = appLocale
    localStorage.setItem('locale', appLocale)
    document.documentElement.lang = appLocale === 'pt' ? 'pt-BR' : appLocale === 'en' ? 'en-US' : 'es-PE'
  }

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const isPublic = to.meta.public === true

  if (!requiresAuth || isPublic) {
    next()
    return
  }

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    next({
      name: 'auth',
      params: { locale: appLocaleToRouteLocale(i18n.global.locale.value as 'es' | 'en' | 'pt') },
      query: { redirect: to.fullPath }
    })
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
