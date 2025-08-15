<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/main.css';

.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  @apply text-theme-text;
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
}

h3 {
  @apply text-theme-heading;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    @apply border-theme-border bg-theme-bg border border-solid;
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    @apply border-theme-border border-l border-solid;
    content: ' ';
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    @apply border-theme-border border-l border-solid;
    content: ' ';
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
