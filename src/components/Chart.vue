<template>
  <div>
    <div class="wrapper">
    <svg width="800" height="800">
      <path class="radial" :d="radialData" transform="translate(100, 100)"></path>
    </svg>
    </div>

  </div>
</template>

<script>
import { scaleLinear } from "d3-scale";
import { lineRadial } from 'd3-shape'
export default {
  data() {
    return {
      revenue: 3,
      rays: 9,
    }
  },
  computed: {
    outerCircleRadius() {
      const scale = scaleLinear()
        .domain([0,10])
        .range([0, 300])
      return scale(this.revenue)
    },
    innerCircleRadius() {
      return this.outerCircleRadius * 0.5
    },
    radialPoints() {
      const step = 2 / (this.rays * 2);
      const points = [];
      for (let i = 0; i <= 2; i += step) {
        const interval = Math.round(i * this.rays);
        const radius = interval % 2 ? this.innerCircleRadius : this.outerCircleRadius
        points.push([Math.PI * i, radius])
      }
      return points
    },
    radialData() {
      const radialLineGenerator = lineRadial();
      return radialLineGenerator(this.radialPoints)
    }
  },
}
</script>

<style>
 .wrapper {
   padding: 100px;
 }
</style>


