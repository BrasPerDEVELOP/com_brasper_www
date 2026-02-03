<template>
  <button
    :class="[
      'rounded font-medium transition-all duration-200 border cursor-pointer',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      variantClasses[props.variant],
      sizeClasses[props.size]
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  primary:
    'bg-primary text-white border-transparent hover:bg-primary-hover disabled:bg-primary',
  secondary:
    'bg-secondary text-white border-transparent hover:bg-secondary/90 disabled:bg-secondary',
  outline:
    'bg-transparent border-primary text-primary hover:bg-primary/10 disabled:bg-transparent',
  text:
    'bg-transparent border-transparent text-primary hover:bg-primary/10 disabled:bg-transparent'
}

const sizeClasses = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-5 py-2.5 text-base',
  large: 'px-7 py-3.5 text-lg'
}
</script>
