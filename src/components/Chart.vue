<template>
  <div class="wrapper">
    <svg width="500" height="500">
      <defs>
        <radialGradient id="exampleGradient">
          <stop offset="5%" stop-color="white" />
          <stop offset="95%" :stop-color="starColor" />
        </radialGradient>
      </defs>
      <path
        class="radial"
        :d="radialData"
        transform="translate(300, 300)"
        fill="url(#exampleGradient)"
      ></path>
    </svg>
    <aside>
      <div class="range-input">
        <input type="range" name="rays" min="4" max="90" v-model="rays" />
        <label for="rays">Rays</label>
      </div>
      <div class="range-input">
        <input type="range" name="radius" min="10" max="50" v-model="radius" />
        <label for="radius">Radius</label>
      </div>
      <div class="range-input">
        <input type="range" name="heat" min="1" max="100" v-model="heat" />
        <label for="rays">Heat</label>
      </div>
    </aside>
  </div>
</template>

<script>
import { interpolateCubehelixDefault } from 'd3';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { lineRadial } from 'd3-shape';
export default {
  data() {
    return {
      radius: 20,
      rays: 5,
      heat: 5,
    };
  },
  computed: {
    outerCircleRadius() {
      const scale = scaleLinear()
        .domain([0, 100])
        .range([0, 300]);
      return scale(this.radius);
    },
    innerCircleRadius() {
      return this.outerCircleRadius * 0.5;
    },
    radialPoints() {
      const step = 2 / (this.rays * 2);
      const points = [];
      for (let i = 0; i <= 2; i += step) {
        const interval = Math.round(i * this.rays);
        const radius =
          interval % 2 ? this.innerCircleRadius : this.outerCircleRadius;
        points.push([Math.PI * i, radius]);
      }
      return points;
    },
    radialData() {
      const radialLineGenerator = lineRadial();
      return radialLineGenerator(this.radialPoints);
    },
    starColor() {
      const myColor = scaleLinear()
        .domain([0, 25, 50, 75, 100])
        .range(['red', 'orange', 'yellow', 'lightblue', '#adadff']);
      return myColor(this.heat);
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  align-items: center;
}
.range-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  input {
    margin-right: 10px;
  }
}
</style>
