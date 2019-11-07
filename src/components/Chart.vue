<template>
  <div class="wrapper">
    <h1>Vue Constellation</h1>
    <div class="image-wrapper">
      <div class="svg-bg">
        <svg width="700" height="700">
          <defs>
            <radialGradient id="star-gradient">
              <stop offset="2%" stop-color="white" />
              <stop offset="95%" stop-color="green" />
            </radialGradient>
          </defs>
          <path
            class="radial"
            transform="translate(250, 250)"
            :fill="`url(#star-gradient)`"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { transformData } from '../utils';
const starColors = ['#ff7665', '#ffb469', '#ffe876', '#fff', '#99cdff'];
export default {
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.wrapper {
  font-family: Arial;
  padding-top: 30px;
  text-align: center;
}
h1 {
  padding-bottom: 30px;
}

.image-wrapper {
  display: flex;
  justify-content: center;
}
.svg-bg {
  background-image: url('/stars.jpeg');
}
.legend {
  padding-left: 40px;
  font-size: 20px;
  line-height: 50px;
  text-align: left;
}
.transform {
  transition: all 0.5s ease-in;
}

.transform:hover {
  cursor: pointer;
  transform: rotate(40deg) scale(1.3);
}

.description {
  font-family: Arial;
  pointer-events: none;
  position: absolute;
  font-size: 16px;
  text-align: center;
  background: rgba(30, 30, 30, 0.95);
  padding: 10px 15px;
  z-index: 5;
  height: 120px;
  line-height: 30px;
  margin: 0 auto;
  color: #fff;
  border-radius: 5px;
  transform: translateX(-50%);
  &.active {
    display: block;
  }
  &:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    width: 0;
    height: 0;
    margin-left: -10px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid rgba(30, 30, 30, 0.9);
  }
}
</style>
