import { createSpan } from '../../create-elements-functions/create-span';
import { loadedData } from '../../google-drive/gdrive-storage-functions';
import { settings, timeLog } from '../../main';

export function evaluateGoal() {
  if (document.querySelector('#goal-in-app-text')) {
    let hoursLeftUntilGoal = loadedData['goalHoursPerWeek'];
    let sumHours = 0;
    /*  const timeLogObject = timeLog.loggedHoursWholeWeek; */
    const timeLogObject = timeLog.loggedHoursWholeWeek;

    for (const day in timeLogObject) {
      if (timeLogObject[day].length != 0) {
        timeLogObject[day].forEach((hour) => {
          hoursLeftUntilGoal = hoursLeftUntilGoal - hour;
          sumHours += hour;
        });
      }
    }

    printEvaluationInApp(hoursLeftUntilGoal, sumHours);
  } else return;
}

function printEvaluationInApp(hoursLeftUntilGoal, sumHours) {
  const goalInAppWrapper = document.querySelector('#goal-in-app-wrapper');
  const goalEvalTextSelector = document.querySelector('#goal-evaluation-text');
  const sumHoursEvalTextSelector = document.querySelector('#goal-evaluation-text-sum-hours');
  if (goalEvalTextSelector) {
    goalEvalTextSelector.remove();
  }
  if (sumHoursEvalTextSelector) {
    sumHoursEvalTextSelector.remove();
  }
  if (hoursLeftUntilGoal > 0) {
    createSpan(
      `${hoursLeftUntilGoal} hours left until goal`,
      'goal-evaluation-text',
      'in-app-text',
      goalInAppWrapper
    );
    createSpan(
      `${sumHours} hours logged for this week`,
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
      `${sumHours} hours logged for this week`,
      'goal-evaluation-text-sum-hours',
      'in-app-text',
      goalInAppWrapper
    );
    span.style.color = '#4ade80';
    spanGoalComplete.style.color = '#4ade80';
  }
}
