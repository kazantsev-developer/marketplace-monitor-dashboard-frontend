<template>
  <div ref="wrapperRef" class="theme-switch" @click="toggleTheme">
    <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'" class="text-xl cursor-pointer"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(true);
const wrapperRef = ref<HTMLDivElement | null>(null);

const applyTheme = (dark: boolean) => {
  const html = document.documentElement;
  if (dark) {
    html.classList.add('dark');
    html.classList.remove('light');
  } else {
    html.classList.add('light');
    html.classList.remove('dark');
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};

const toggleTheme = async () => {
  const nextDark = !isDark.value;

  if (!document.startViewTransition) {
    isDark.value = nextDark;
    applyTheme(nextDark);
    return;
  }

  const transition = document.startViewTransition(() => {
    isDark.value = nextDark;
    applyTheme(nextDark);
  });

  await transition.ready;

  const rect = wrapperRef.value?.getBoundingClientRect();
  if (!rect) return;

  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const right = window.innerWidth - rect.left;
  const bottom = window.innerHeight - rect.top;
  const maxRadius = Math.hypot(Math.max(rect.left, right), Math.max(rect.top, bottom));

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    }
  );
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  isDark.value = shouldBeDark;
  applyTheme(shouldBeDark);
});
</script>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>