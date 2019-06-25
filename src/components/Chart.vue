<template>
  <div>
    <div class="wrapper">
      <svg width="800" height="800">
        <defs>
          <radialGradient id="exampleGradient">
            <stop offset="5%" stop-color="white" />
            <stop offset="95%" :stop-color="starColor" />
          </radialGradient>
        </defs>
        <path
          class="radial"
          :d="radialData"
          transform="translate(100, 100)"
          fill="url(#exampleGradient)"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { interpolateCubehelixDefault } from 'd3';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { lineRadial } from 'd3-shape';
export default {
  data() {
    return {
      revenue: 30,
      rays: 9,
      heat: 90,
    };
  },
  computed: {
    outerCircleRadius() {
      const scale = scaleLinear()
        .domain([0, 100])
        .range([0, 300]);
      return scale(this.revenue);
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
        .range(['red', 'orange', 'yellow', 'lightblue', 'blue']);
      return myColor(this.heat);
    },
  },
};
</script>

<style>
.wrapper {
  padding: 100px;
}
</style>
