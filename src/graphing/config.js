const quadrantSize = 512
const quadrantGap = 32

const getQuadrants = () => {
  return JSON.parse(process.env.QUADRANTS || null) || [
    {
      name: 'Tools',
      description: 'Technologies such as frameworks, libraries, and utilities used to build and operate systems.'
    },
    {
      name: 'Platforms',
      description: 'Foundational environments or ecosystems that we build solutions on top of.'
    },
    {
      name: 'Internal Solutions',
      description: 'Internally-developed systems and services.'
    },
    {
      name: 'Techniques',
      description: 'Practices, patterns, and methodologies that guide how work is done.'
    }
  ]
}

const getRings = () => {
  return JSON.parse(process.env.RINGS || null) || [
    {
      name: 'Adopt',
      description: 'Items that are mature and recommended for widespread use.'
    },
    {
      name: 'Assess',
      description: 'Items that are recommended but not mandatory; teams may experiment with them to determine fit and value.'
    },
    {
      name: 'Contain',
      description: 'Items that are no longer strategic and should not be adopted for new solutions; usage should be limited and phased out.'
    },
    {
      name: 'End-of-Life',
      description: 'Items no longer supported or approved for use as of a given date; teams should plan for decommissioning or replacement.'
    }
  ]
}

const isBetween = (number, startNumber, endNumber) => {
  return startNumber <= number && number <= endNumber
}
const isValidConfig = () => {
  return getQuadrants().length === 4 && isBetween(getRings().length, 1, 4)
}

const graphConfig = {
  effectiveQuadrantHeight: quadrantSize + quadrantGap / 2,
  effectiveQuadrantWidth: quadrantSize + quadrantGap / 2,
  quadrantHeight: quadrantSize,
  quadrantWidth: quadrantSize,
  quadrantsGap: quadrantGap,
  minBlipWidth: 12,
  blipWidth: 22,
  groupBlipHeight: 24,
  newGroupBlipWidth: 88,
  existingGroupBlipWidth: 124,
  rings: getRings(),
  quadrants: getQuadrants(),
  groupBlipAngles: [30, 35, 60, 80],
  maxBlipsInRings: [8, 22, 17, 18],
}

const uiConfig = {
  subnavHeight: 60,
  bannerHeight: 200,
  tabletBannerHeight: 300,
  headerHeight: 80,
  legendsHeight: 42,
  tabletViewWidth: 1280,
  mobileViewWidth: 768,
}

function getScale() {
  return window.innerWidth < 1800 ? 1.25 : 1.5
}

function getGraphSize() {
  return graphConfig.effectiveQuadrantHeight + graphConfig.effectiveQuadrantWidth
}

function getScaledQuadrantWidth(scale) {
  return graphConfig.quadrantWidth * scale
}

function getScaledQuadrantHeightWithGap(scale) {
  return (graphConfig.quadrantHeight + graphConfig.quadrantsGap) * scale
}

module.exports = {
  graphConfig,
  uiConfig,
  getScale,
  getGraphSize,
  getScaledQuadrantWidth,
  getScaledQuadrantHeightWithGap,
  isValidConfig,
}
