import { gql } from '@apollo/client';

export const GET_INSIGHTS = gql`
  query GetInsights(
    $userId: String!
    $filter: String!
    $timezoneOffset: Int
    $baseDate: String
  ) {
    insights: getInsights(
      userId: $userId
      filter: $filter
      timezoneOffset: $timezoneOffset
      baseDate: $baseDate
    ) {
      totalFocusHours {
        value
        change
        trend
      }
      taskCompletion {
        value
        change
        trend
      }
      energyScore {
        value
        change
        trend
      }
      goldenWindow {
        value
        change
        trend
      }
      breakHours {
        value
        change
        trend
      }
      productivityTrends {
        label
        actual
        planned
      }
      timeDistribution {
        name
        value
        color
      }
      heatmap
      heatmapLabels
      heatmapCells {
        key
        label
        intensity
        count
        tasks {
          id
          title
          completedAt
          category
          realTimer
        }
      }
    }
  }
`;
