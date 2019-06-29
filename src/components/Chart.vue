<template>
  <div class="wrapper">
    <h1>Vue Constellation</h1>
    <div class="image-wrapper">
      <svg width="700" height="700">
        <rect width="100%" height="100%" fill="#0E0432" />
        <g
          v-for="repo in layoutData.children"
          :key="repo.data.name"
          :style="{
            transform: `translate(${repo.x}px, ${repo.y}px)`,
          }"
          @mouseenter="showTooltip(repo.data)"
          @mouseout="hideTooltip"
        >
          <defs>
            <radialGradient :id="repo.gradient">
              <stop offset="2%" stop-color="white" />
              <stop offset="95%" :stop-color="repo.starColor" />
            </radialGradient>
          </defs>
          <path
            class="radial transform"
            :d="repo.radialData"
            :fill="`url(#${repo.gradient})`"
          ></path>
        </g>
      </svg>
      <div class="legend">
        <p>Star radius ~ GitHub repo stars amount</p>
        <p>Star rays ~ contributors</p>
        <p>Star color ~ open issues (from red to blue, like real stars 😊)</p>
      </div>
    </div>
    <div class="description" v-if="tooltipVisible" :style="tooltipPosition">
      <h3>{{ tooltipRepo.name }}</h3>
      <p>stars: {{ tooltipRepo.stars }}</p>
      <p>contributors: {{ tooltipRepo.contributors }}</p>
      <p>open issues: {{ tooltipRepo.issues }}</p>
    </div>
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
      tooltipVisible: false,
      tooltipRepo: null,
      tooltipPosition: {
        left: 0,
        top: 0,
      },
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
    showTooltip(repo) {
      this.tooltipVisible = true;
      this.tooltipRepo = { ...repo };
    },
    hideTooltip() {
      this.tooltipVisible = false;
      this.tooltipRepo = null;
    },
  },
  computed: {
    transformedRepoData() {
      const source = {
        name: 'Top Level',
        children: this.repositories.map(repo => ({
          ...repo,
          parent: 'Top Level',
        })),
      };
      const rootHierarchy = hierarchy(source)
        .sum(d => d.stars)
        .sort((a, b) => {
          return b.value - a.value;
        });
      return pack()
        .size([700, 700])
        .padding(40)(rootHierarchy);
    },
    layoutData() {
      const children = this.transformedRepoData.children.map(repo => ({
        ...repo,
        starColor: this.starColor(repo.data),
        radialData: this.radialData(repo),
        gradient: `starGradient-${repo.data.name}`,
      }));
      return {
        ...this.transformedRepoData,
        children,
      };
    },
  },
  mounted() {
    document.addEventListener('mousemove', e => {
      this.tooltipPosition.left = e.pageX + 'px';
      this.tooltipPosition.top = e.pageY - 155 + 'px';
    });
  },
  beforeDestroy() {
    document.removeEventListener('mousemove');
  },
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
