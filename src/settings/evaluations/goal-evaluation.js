import { getWeekNumber } from '../../calendars/date-functions';
import { createSpan } from '../../create-elements-functions/create-span';
import { loadedData } from '../../google-drive/gdrive-storage-functions';
import { settings, timeLog } from '../../main';
import { returnWeeklyHours } from '../../other-functions/return-gdrive-object-values';

let sumHours = 0;
export function evaluateGoal() {
  if (document.querySelector('#goal-in-app-text')) {
    const weeklyHoursCompleted = returnWeeklyHours();
    const hoursLeftUntilGoal =
      loadedData['goalHoursPerWeekData']['hoursHighest'] - weeklyHoursCompleted;
    /*     sumHours += hoursCompleted; */
    printEvaluationInApp(hoursLeftUntilGoal, weeklyHoursCompleted);
  }
}

function printEvaluationInApp(hoursLeftUntilGoal, weeklyHoursCompleted) {
  const goalInAppWrapper = document.querySelector('#goal-in-app-wrapper');
  const goalEvalTextSelector = document.querySelector('#goal-evaluation-text');
  const sumHoursEvalTextSelector = document.querySelector('#goal-evaluation-text-sum-hours');
  if (goalEvalTextSelector) {
    goalEvalTextSelector.remove();
  }
  if (sumHoursEvalTextSelector) {
    sumHoursEvalTextSelector.remove();
  }
  if (hoursLeftUntilGoal != undefined) {
    if (hoursLeftUntilGoal > 0) {
      createSpan(
        `${hoursLeftUntilGoal} hours left until goal`,
        'goal-evaluation-text',
        'in-app-text',
        goalInAppWrapper
      );
      createSpan(
        `${weeklyHoursCompleted} hours logged for this week`,
        'goal-evaluation-text-sum-hours',
        'in-app-text',
        goalInAppWrapper
      );
    } else {
      const spanGoalComplete = createSpan(
        `0 hours left until goal. You completed this weeks goal! `,
        'goal-evaluation-text',
        'in-app-text',
        goalInAppWrapper
      );
      const span = createSpan(
        `${weeklyHoursCompleted} hours logged for this week`,
        'goal-evaluation-text-sum-hours',
        'in-app-text',
        goalInAppWrapper
      );
      span.style.color = '#4ade80';
      spanGoalComplete.style.color = '#4ade80';
    }
  }
}
