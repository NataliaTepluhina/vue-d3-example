<template>
  <div>
      <svg width="500" height="500">
        <g
          class="flower"
          v-for="flower in layoutData.children"
          :key="flower.data.name"
          :style="{
            transform: `translate(${flower.x}px, ${flower.y}px)`
          }"
        >
          <circle
            class="flower__circle"
            :r="flower.r"
            :fill="flower.data.color"
          />
          <text class=“flower__label”>
            {{ flower.data.name }}
          </text>
        </g>
      </svg>
  </div>
</template>

<script>
import { hierarchy, pack } from 'd3-hierarchy'
export default {
  data() {
    return {
      flowers: [
        {
          name: 'Roses',
          amount: 25,
          color: '#cc2936'
        },
        {
          name: 'Tulips',
          amount: 40,
          color: '#f2c640'
        },
        {
          name: 'Daisies',
          amount: 15,
          color: '#2a93d4'
        },
        {
          name: 'Narcissuses',
          amount: 9,
          color: '#F7AD0A'
        }
      ]
    }
  },
  computed: {
    transformedFlowerData() {
      return {
        name: 'Top Level',
        children: this.flowers.map(flower => ({
          ...flower,
          size: flower.amount,
          parent: 'Top Level'
        }))
      }
    },

    layoutData() {
      // Generate a D3 hierarchy
      const rootHierarchy = hierarchy(this.transformedFlowerData)
        .sum(d => d.size)
        .sort((a, b) => {
          return b.value - a.value
        })

      // Pack the circles inside the viewbox
      return pack()
        .size([500, 500])
        .padding(10)(rootHierarchy)
    }
  }
}
</script>

