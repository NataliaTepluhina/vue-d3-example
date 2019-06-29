<template>
  <div class="wrapper">
    <svg width="800" height="800">
      <rect width="100%" height="100%" fill="#0E0432" />
      <g
        v-for="repo in layoutData.children"
        :key="repo.data.name"
        :style="{
          transform: `translate(${repo.x}px, ${repo.y}px)`,
        }"
      >
        <defs>
          <radialGradient :id="`starGradient-${repo.data.name}`">
            <stop offset="2%" stop-color="white" />
            <stop offset="95%" :stop-color="starColor(repo.data)" />
          </radialGradient>
        </defs>
        -->
        <path
          class="radial"
          :d="radialData(repo)"
          :fill="`url(#starGradient-${repo.data.name})`"
        ></path>
      </g>
    </svg>
  </div>
</template>

<script>
import { scaleLinear, scaleSequential } from 'd3-scale';
import { lineRadial } from 'd3-shape';
import { min, max } from 'd3-array';
import { hierarchy, pack } from 'd3-hierarchy';
import dataset from '../assets/dataset';
export default {
  data() {
    return {
      repositories: dataset,
    };
  },
  methods: {
    minValue(prop) {
      const arr = this.repositories.map(repo => repo[prop]);
      return min(arr);
    },
    maxValue(prop) {
      const arr = this.repositories.map(repo => repo[prop]);
      return max(arr);
    },
    radialPoints(repo) {
      const scale = scaleLinear()
        .domain([this.minValue('contributors'), this.maxValue('contributors')])
        .range([4, 80]);
      const rays = Math.round(scale(repo.data.contributors));
      const step = 2 / (rays * 2);
      const points = [];
      for (let i = 0; i <= 2; i += step) {
        const interval = Math.round(i * rays);
        const radius = interval % 2 ? repo.r * 0.5 : repo.r;
        points.push([Math.PI * i, radius]);
      }
      return points;
    },
    radialData(repo) {
      const radialLineGenerator = lineRadial();
      return radialLineGenerator(this.radialPoints(repo));
    },
    starColor(repo) {
      const scaledIssues = scaleLinear()
        .domain([this.minValue('issues'), this.maxValue('issues')])
        .range([0, 100]);
      const myColor = scaleLinear()
        .domain([0, 25, 50, 75, 100])
        .range(['#ff7665', '#ffb469', '#ffe876', '#fff', '#99cdff']);
      return myColor(scaledIssues(repo.issues));
    },
  },
  computed: {
    transformedRepoData() {
      return {
        name: 'Top Level',
        children: this.repositories.map(repo => ({
          ...repo,
          parent: 'Top Level',
        })),
      };
    },
    layoutData() {
      const rootHierarchy = hierarchy(this.transformedRepoData)
        .sum(d => d.stars)
        .sort((a, b) => {
          return b.value - a.value;
        });
      return pack()
        .size([800, 800])
        .padding(40)(rootHierarchy);
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
