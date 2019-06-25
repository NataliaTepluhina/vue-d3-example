<template>
  <div>
    <svg width="800" height="800">
      
    </svg>
  </div>
</template>

<script>
import { scaleLinear } from "d3-scale";
import { lineRadial } from 'd3-shape'
export default {
  data() {
    return {
      revenue: 3,
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
      console.log(lineRadial)
      return this.outerCircleRadius * 0.75
    }
  },
}
</script>

