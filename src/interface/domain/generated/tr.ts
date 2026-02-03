// AUTO-GENERATED: no editar a mano. Ejecutar: npm run i18n:generate

/**
 * Claves de traducción. Uso: t(TR.forgotPassword) o $t(TR.create)
 */
export const TR = {
  /** Crear | create */
  get create(): string {
    return 'create'
  },
  /** Editar | edit */
  get edit(): string {
    return 'edit'
  },
  /** Guardar | save */
  get save(): string {
    return 'save'
  },
  /** Cancelar | cancel */
  get cancel(): string {
    return 'cancel'
  },
  /** Eliminar | delete */
  get delete(): string {
    return 'delete'
  },
  /** Cerrar | close */
  get close(): string {
    return 'close'
  },
  /** ¿Has olvidado tu contraseña? | forgot_password */
  get forgotPassword(): string {
    return 'forgot_password'
  },
  /** Crear cuenta | create_account */
  get createAccount(): string {
    return 'create_account'
  },
  /** Iniciar sesión | login */
  get login(): string {
    return 'login'
  },
  /** Cerrar sesión | logout */
  get logout(): string {
    return 'logout'
  },
  /** Correo electrónico | email */
  get email(): string {
    return 'email'
  },
  /** Contraseña | password */
  get password(): string {
    return 'password'
  },
  /** Crear proyecto | create_project */
  get createProject(): string {
    return 'create_project'
  },
  /** Nueva Área | new_area */
  get newArea(): string {
    return 'new_area'
  },
  /** Editar Área | edit_area */
  get editArea(): string {
    return 'edit_area'
  }
} as const

export type TRKey = (typeof TR)[keyof typeof TR]
